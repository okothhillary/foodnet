import { addToCart, updateCart, getCart, updateCartDisplay } from './cart.js';

const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Fetch all meals data from the API
async function fetchAllMeals() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.meals) {
            data.meals.forEach(meal => {
                if (!meal.strMealThumb) {
                    console.error("Missing image for meal:", meal);
                    meal.strMealThumb = 'default-image.jpg'; 
                }
            });
        }
        return data.meals || [];
    } catch (error) {
        console.error("Error fetching meals:", error);
        return [];
    }
}

// Get the restaurant ID from the URL query parameter (default is 1)
function getRestaurantId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('restaurant')) || 1;
}

// Rotate meals for different restaurants
function getRestaurantMeals(allMeals) {
    const restaurantId = getRestaurantId();
    const offset = ((restaurantId - 1) * 15) % allMeals.length;
    return allMeals.slice(offset).concat(allMeals.slice(0, offset));
}

// Get current page from URL
function getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('page')) || 1;
}

function renderDishes(meals, currentPage) {
    const dishesList = document.getElementById('dishes-list');
    dishesList.innerHTML = ''; 
    const cart = getCart();

    const startIndex = (currentPage - 1) * 15;
    const endIndex = startIndex + 15;
    const paginatedMeals = meals.slice(startIndex, endIndex);

    if (paginatedMeals.length === 0) {
        dishesList.innerHTML = "<p>These guys want you to fast.</p>";
        return;
    }

    paginatedMeals.forEach(meal => {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'dish';
        dishDiv.setAttribute('data-meal-id', meal.idMeal);

        // Meal Image
        const img = document.createElement('img');
        img.src = meal.strMealThumb || 'default-image.jpg';
        img.alt = meal.strMeal;
        dishDiv.appendChild(img);

        // Meal Name
        const name = document.createElement('h2');
        name.textContent = meal.strMeal;
        dishDiv.appendChild(name);

        // Meal Description
        const description = document.createElement('p');
        const descText = meal.strInstructions ? meal.strInstructions.substring(0, 100) + '...' : 'Meal is too alien for a description. Ha!';
        description.textContent = descText;
        dishDiv.appendChild(description);

         
        const price = document.createElement('p');
        const randomPrice = (Math.floor(Math.random() * 21) + 10).toFixed(2);
        price.textContent = `Price: Ksh.${randomPrice}`;
        dishDiv.appendChild(price);
        meal.price = parseFloat(randomPrice);


        // Cart Controls
        const cartControls = document.createElement('div');
        cartControls.className = 'cart-controls';

        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.addEventListener('click', () => {
            updateCart(meal.idMeal, -1);
            updateCartDisplay(); 
            quantityDisplay.textContent = cart[meal.idMeal] ? cart[meal.idMeal].quantity : 0;
        });

        const quantityDisplay = document.createElement('span');
        quantityDisplay.textContent = cart[meal.idMeal] ? cart[meal.idMeal].quantity : 0;

        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.addEventListener('click', () => {
            addToCart(meal);
            updateCartDisplay();
            quantityDisplay.textContent = cart[meal.idMeal] ? cart[meal.idMeal].quantity : 0;
        });

        cartControls.appendChild(minusButton);
        cartControls.appendChild(quantityDisplay);
        cartControls.appendChild(plusButton);

        dishDiv.appendChild(cartControls);
        dishesList.appendChild(dishDiv);
    });
}

// Render Pagination
function renderPagination(totalMeals, currentPage) {
    const dishesList = document.getElementById('dishes-list');
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';

    const totalPages = Math.ceil(totalMeals / 15);

    if (currentPage > 1) {
        const prevLink = document.createElement('a');
        prevLink.href = `?restaurant=${getRestaurantId()}&page=${currentPage - 1}`;
        prevLink.textContent = 'Previous';
        paginationDiv.appendChild(prevLink);
    }

    if (currentPage < totalPages) {
        const nextLink = document.createElement('a');
        nextLink.href = `?restaurant=${getRestaurantId()}&page=${currentPage + 1}`;
        nextLink.textContent = 'Next';
        paginationDiv.appendChild(nextLink);
    }

    dishesList.appendChild(paginationDiv);
}

// Main Function to Display Dishes
async function displayDishes() {
    const allMeals = await fetchAllMeals();
    if (allMeals.length === 0) {
        document.getElementById('dishes-list').innerHTML = "<p>No dishes available.</p>";
        return;
    }
    const restaurantMeals = getRestaurantMeals(allMeals);
    const currentPage = getCurrentPage();
    renderDishes(restaurantMeals, currentPage);
    renderPagination(restaurantMeals.length, currentPage);
}

document.addEventListener('DOMContentLoaded', displayDishes);
