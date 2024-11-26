from flask import Flask, render_template, request, jsonify, session
import requests
from cs50 import SQL
import sqlite3

app = Flask(__name__)

# Spoonacular API key
API_KEY = 'de2a4da9972249e8836a2d33ae267457'

header = {
    "x-api-key" : API_KEY,
}

db = SQL("sqlite:///recipe_history.db")

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('query', '')
    if not query:
        return jsonify([])

    url = f'https://api.spoonacular.com/recipes/autocomplete?query={query}&number=5'
    response = requests.get(url, headers=header)

    if response.status_code == 200:
        suggestions = response.json()
        return jsonify(suggestions)
    else:
        return jsonify([])


def log_history(recipe_id, recipe_name):
    db.execute("INSERT INTO history (recipe_id, recipe_name) VALUES (?, ?)", recipe_id, recipe_name)


@app.route('/get_recipe', methods=['POST'])
def get_recipe():
    # Get the recipe name from the frontend
    recipe_name = request.json.get('recipe_name')

    # Search for recipes by name
    search_url = f'https://api.spoonacular.com/recipes/complexSearch?query={recipe_name}'
    response = requests.get(search_url, headers=header)

    search_response = requests.get(search_url, headers = header)
    search_data = search_response.json()

    # Check for results
    if 'results' in search_data and search_data['results']:
        recipe = search_data['results'][0]
        recipe_id = recipe['id']

        # Fetch detailed recipe information
        details_url = f'https://api.spoonacular.com/recipes/{recipe_id}/information'
        details_response = requests.get(details_url, headers = header)
        details_data = details_response.json()

        # Extract ingredients and nutrition
        ingredients = [
            {'name': ing['name'], 'amount': ing['amount'], 'unit': ing['unit']}
            for ing in details_data.get('extendedIngredients', [])
        ]

        nutrition_url = f'https://api.spoonacular.com/recipes/{recipe_id}/nutritionWidget.json'
        nutrition_response = requests.get(nutrition_url, headers = header)
        nutrition_data = nutrition_response.json()

        instruction_url= f'https://api.spoonacular.com/recipes/{recipe_id}/analyzedInstructions'
        instruction_response = requests.get(instruction_url, headers = header)
        instruction_data = instruction_response.json()

        # Structure the response
        recipe_info = {
            'title': details_data.get('title', 'Unknown Recipe'),
            'image': details_data.get('image', ''),
            'ingredients': ingredients,
            'instruction': [{'number': step['number'], 'equipment': step['equipment'],
                            'ingredients': step['ingredients'], 'step': step['step']}
                            for step in instruction_data[0].get('steps', [])],
            'nutrition': [
                {'name': nut['name'], 'amount': nut['amount'], 'unit': nut['unit'], 'percentage' : nut['percentOfDailyNeeds']}
                for nut in nutrition_data["nutrients"]
            ]
        }

        log_history(recipe_id, details_data.get('title', 'Unknown Recipe'))

        return jsonify(recipe_info)
    else:
        return jsonify({'message': 'No recipe found'}), 404


@app.route('/get_history', methods=['GET'])
def get_history():
    history = db.execute("SELECT recipe_id, recipe_name, timestamp FROM history ORDER BY timestamp DESC LIMIT 10")
    return jsonify(history)


if __name__ == "__main__":
    app.run(debug=True)
