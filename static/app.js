// AUTOCOMPLETE FEATURE
const recipeInput = document.getElementById('recipeInput');
const suggestionsList = document.getElementById('suggestions');

// Event listener for input changes
recipeInput.addEventListener('input', async () => {
    const query = recipeInput.value.trim();
    suggestionsList.innerHTML = ''; // Clear suggestions

    if (query.length < 2) return; // Wait until user types at least 2 characters

    try {
        // Fetch suggestions from the backend
        const response = await fetch(`/autocomplete?query=${query}`);
        if (response.ok) {
            const suggestions = await response.json();

            // Render suggestions
            suggestions.forEach(suggestion => {
                const item = document.createElement('li');
                item.className = 'list-group-item list-group-item-action';
                item.textContent = suggestion.title;

                // On click, populate the input and clear suggestions
                item.addEventListener('click', () => {
                    recipeInput.value = suggestion.title;
                    suggestionsList.innerHTML = '';
                });

                suggestionsList.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
});

// SEARCH BUTTON FUNCTIONALITY
document.getElementById('searchBtn').addEventListener('click', async () => {
    const recipeName = document.getElementById('recipeInput').value;
    const resultDiv = document.getElementById('recipeResult');

    resultDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch('/get_recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipe_name: recipeName }),
        });

        if (response.ok) {
            const data = await response.json();
            renderRecipe(data);
        } else {
            resultDiv.innerHTML = 'Recipe not found!';
        }
    } catch (error) {
        resultDiv.innerHTML = 'Error fetching recipe!';
    }
});

// Variable to hold the current chart instance
let nutritionChart = null;

// FUNCTION TO RENDER THE RECIPE
function renderRecipe(data) {
    const resultDiv = document.getElementById('recipeResult');
    resultDiv.innerHTML = `
        <h3>${data.title}</h3>
        <img src="${data.image}" class="img-fluid mb-3" alt="${data.title}">
        <h4>Ingredients:</h4>
        <ul>
            ${data.ingredients.map(i => `<li>${i.amount} ${i.unit} ${i.name}</li>`).join('')}
        </ul>
        <h4>Steps:</h4>
        <ul>
            ${data.instruction.map(i => `<li>${i.number}. ${i.step}</li>`).join('')}
        </ul>
        <h4>Nutrition:</h4>
        <ul>
            ${data.nutrition.map(n => `<li>${n.name}: ${n.amount}${n.unit} ${n.percentage}% of daily needs</li>`).join('')}
        </ul>
    `;

    // Prepare data for the chart
    const nutrientLabels = data.nutrition.map(n => n.name);
    const nutrientPercentages = data.nutrition.map(n => n.percentage);

    // Destroy the existing chart if it exists
    if (nutritionChart) {
        nutritionChart.destroy();
    }

    // Render the new chart
    const ctx = document.getElementById('nutritionChart').getContext('2d');
    nutritionChart = new Chart(ctx, {
        type: 'bar', // Change to 'pie' or 'doughnut' if preferred
        data: {
            labels: nutrientLabels,
            datasets: [{
                label: 'Daily Needs Fulfilled (%)',
                data: nutrientPercentages,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Nutrients'
                    }
                }
            }
        }
    });
}


async function fetchHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = 'Loading...';

    try {
        const response = await fetch('/get_history');
        if (response.ok) {
            const history = await response.json();
            historyList.innerHTML = history.map(entry => `
                <li class="list-group-item">
                    <strong>${entry.recipe_name}</strong>
                    (Viewed on: ${new Date(entry.timestamp).toLocaleString()})
                </li>
            `).join('');
        } else {
            historyList.innerHTML = '<li class="list-group-item">No history found.</li>';
        }
    } catch (error) {
        historyList.innerHTML = '<li class="list-group-item">Error loading history.</li>';
    }
}

// Call fetchHistory on page load
document.addEventListener('DOMContentLoaded', fetchHistory);
