# Recipe Finder App
#### Description:

The Recipe Finder App is a web application designed to help users find recipes, explore detailed nutritional information, and track their search history. Built using Flask, JavaScript, and SQLite, this project integrates skills I’ve learned from CS50, including Python programming, API usage, database management, and creating responsive web interfaces.

---

## Overview

The Recipe Finder App connects to the Spoonacular API to retrieve recipe data and provide users with an interactive and user-friendly experience. The app includes the following core features:
1. **Search Functionality**: Users can search for recipes using a real-time autocomplete feature.
2. **Detailed Recipe Information**: Displays ingredients, step-by-step instructions, and a nutrition breakdown for the selected recipe.
3. **Nutritional Chart**: A visual representation of how much each recipe fulfills daily nutritional needs, using a bar chart powered by Chart.js.
4. **History Tracking**: Keeps track of the user’s most recently viewed recipes, stored in a SQLite database.

This app not only provides recipe suggestions but also promotes informed cooking choices by helping users understand nutritional values at a glance.

---

## Files in the Project

### 1. **`app.py`**
The Flask backend that handles routing, API integration, and database operations. Key functionalities include:
- **Routes**:
  - `/`: The home page of the app.
  - `/autocomplete`: Fetches suggestions from the Spoonacular API based on user input.
  - `/get_recipe`: Retrieves detailed recipe data, including ingredients, instructions, and nutritional information.
  - `/get_history`: Returns the user's recent recipe history from the SQLite database.

- **Database Operations**:
  - Inserts new records of viewed recipes into the `history` table.
  - Retrieves the last 10 recipes for the history feature.

### 2. **`templates/index.html`**
The main HTML file for the web interface. It includes a search bar, result display area, and a section for recipe history. Bootstrap is used for styling and layout.

### 3. **`static/style.css`**
Custom CSS to enhance the app's appearance, ensuring a clean and responsive user experience. Features include:
- Styling for the search bar and results.
- Formatting for the history list and nutritional chart.

### 4. **`static/script.js`**
The JavaScript file for frontend interactivity, including:
- Handling the autocomplete feature for recipe search.
- Rendering recipe details and the nutritional chart dynamically.
- Fetching and displaying search history.

### 5. **`recipes.db`**
The SQLite database storing recipe history. It contains a single table, `history`, with the following fields:
- `recipe_id`: A unique identifier for each recipe.
- `recipe_name`: The name of the recipe.
- `timestamp`: The date and time the recipe was viewed.

---

## Design Choices

### **1. User-Friendly Interface**
I prioritized simplicity and accessibility in the design. The autocomplete feature makes searching quick, while the nutritional chart provides an intuitive way to understand recipe values.

### **2. Data Visualization**
Instead of displaying raw nutritional numbers, I used a bar chart to represent how much each nutrient contributes to daily needs. This decision was based on making the information easier to digest for users who might not be familiar with raw data.

### **3. Database Integration**
To ensure users could revisit previously viewed recipes, I included a history feature. Storing this data in SQLite allowed for a lightweight yet effective solution.

### **4. Modular Code Structure**
Each functionality is encapsulated in its respective file, making the project easy to understand and maintain.

---

## Challenges

1. **API Limitations**: The free tier of the Spoonacular API had limited requests, so I implemented caching to minimize redundant calls during development.
2. **Nutrition Data Representation**: Deciding how to best present nutritional information required trial and error, but Chart.js proved to be an effective tool.
3. **Debugging Autocomplete**: Ensuring the autocomplete worked smoothly involved addressing asynchronous issues in JavaScript.

---

## Future Improvements

1. **User Accounts**: Implement a login and register feature to allow personalized recipe history and preferences.
2. **Offline Access**: Cache popular recipes for offline use.
3. **Meal Planning**: Add a feature for users to save multiple recipes into a meal plan.

---

This project reflects the culmination of my learning in CS50. It was a rewarding challenge, and I’m proud of the result. Thank you for reading!
