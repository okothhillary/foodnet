class RestaurantApp {
    constructor() {
        this.restaurantsList = document.getElementById("restaurants-list");
        this.searchBar = document.getElementById("search-bar");
        this.restaurants = [];
        this.init();
    }

    async init() {
        await this.getUserLocation();
        this.searchBar.addEventListener("input", () => this.filterRestaurants());
    }

    async getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    console.log("User Location:", userLocation);
                    await this.fetchRestaurants(userLocation);
                    this.displayRestaurants(this.restaurants);
                },
                async (error) => {
                    console.error("Error getting location:", error);
                    console.log("Using fallback location: Nairobi");
                    const fallbackLocation = { lat: -1.286389, lng: 36.817223 }; // Nairobi
                    await this.fetchRestaurants(fallbackLocation);
                    this.displayRestaurants(this.restaurants);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    async fetchRestaurants(location) {
        const query = `
            [out:json];
            node
                ["amenity"="restaurant"]
                (around:10000, ${location.lat}, ${location.lng});
            out body;
        `;

        try {
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
            const data = await response.json();

            // filter for showing 20 restaurants
            this.restaurants = data.elements
                .map(place => ({
                    name: place.tags.name || "Anonymous!",
                    address: place.tags["addr:street"] || "These guys love hiding",
                    placeId: place.id,
                }))
                .slice(0, 20);

        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        }
    }

    displayRestaurants(restaurants) {
        this.restaurantsList.innerHTML = "";
        if (restaurants.length === 0) {
            this.restaurantsList.innerHTML = "<p>Fasting came soon for you! A blessing!</p>";
            return;
        }

        restaurants.forEach(restaurant => {
            const restaurantCard = document.createElement("div");
            restaurantCard.className = "restaurant-card";
            restaurantCard.innerHTML = `
                <h3>${restaurant.name}</h3>
                <p>${restaurant.address}</p>
                <button onclick="window.location.href='dishes.html?restaurant=${restaurant.placeId}'">View Dishes</button>
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

// start the app when the page loads
window.addEventListener("DOMContentLoaded", () => new RestaurantApp());
