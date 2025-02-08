// restaurants.js
// Fetch and display restaurants using Overpass API

class RestaurantApp {
    constructor() {
        this.restaurantsList = document.getElementById("restaurants-list");
        this.searchBar = document.getElementById("search-bar");
        this.restaurants = [];
        this.init();
    }

    async init() {
        this.getUserLocation();
        this.searchBar.addEventListener("input", () => this.filterRestaurants());
    }

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    console.log("User Location:", userLocation);
                    await this.fetchRestaurants(userLocation);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to get location. Please enable location services.");
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            alert("Your browser does not support geolocation.");
        }
    }

    async fetchRestaurants(location) {
        const radius = 10; // 10 km
        const query = `
            [out:json];
            (
                node["amenity"="restaurant"](around:${radius * 1000}, ${location.lat}, ${location.lng});
                way["amenity"="restaurant"](around:${radius * 1000}, ${location.lat}, ${location.lng});
                relation["amenity"="restaurant"](around:${radius * 1000}, ${location.lat}, ${location.lng});
            );
            out center;`;

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            this.restaurants = data.elements.map(place => ({
                name: place.tags.name || "Unnamed Restaurant",
                address: place.tags["addr:street"] || "Unknown Address",
                osmId: place.id,
            }));

            this.displayRestaurants(this.restaurants);
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        }
    }

    displayRestaurants(restaurants) {
        this.restaurantsList.innerHTML = "";
        if (restaurants.length === 0) {
            this.restaurantsList.innerHTML = "<p>No restaurants found in this area.</p>";
            return;
        }
        restaurants.forEach(restaurant => {
            const restaurantCard = document.createElement("div");
            restaurantCard.className = "restaurant-card";
            restaurantCard.innerHTML = `
                <h3>${restaurant.name}</h3>
                <p>${restaurant.address}</p>
                <button onclick="window.location.href='dishes.html?restaurant=${restaurant.osmId}'">
                    View Dishes
                </button>
            `;
            this.restaurantsList.appendChild(restaurantCard);
        });
    }

    filterRestaurants() {
        const query = this.searchBar.value.toLowerCase();
        const filteredRestaurants = this.restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(query)
        );
        this.displayRestaurants(filteredRestaurants);
    }
}

window.addEventListener("DOMContentLoaded", () => new RestaurantApp());
