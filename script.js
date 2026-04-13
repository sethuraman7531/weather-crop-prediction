document.addEventListener('DOMContentLoaded', () => {

    // --- Loader ---
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500); // 1.5s simulated loading


    // --- Particles.js Configuration ---
    // Make sure the global particlesJS is available from the CDN
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 50, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#00ff88", "#00e1ff", "#ffffff"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
                "size": { "value": 3, "random": true, "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false } },
                "line_linked": { "enable": true, "distance": 150, "color": "#00e1ff", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } },
                    "push": { "particles_nb": 2 }
                }
            },
            "retina_detect": true
        });
    }

    // --- Mock Database for Crops (550+ entries) ---
    // Loaded from crops.js

    // --- DOM Elements ---
    const form = document.getElementById('prediction-form');
    const input = document.getElementById('crop-input');
    const resultsArea = document.getElementById('results-area');
    const warningArea = document.getElementById('warning-area');

    // Result fields for Top Section
    const resCropName = document.getElementById('res-crop-name');
    const resSeason = document.getElementById('res-season');
    const resTemp = document.getElementById('res-temp');
    const resRain = document.getElementById('res-rain');
    const resHumidity = document.getElementById('res-humidity');
    const resIcons = document.getElementById('res-weather-icons');
    const topWeather = document.getElementById('top-right-weather');

    // Result fields for Catalog Section
    const resCatalog = document.getElementById('res-catalog');
    const resScientificName = document.getElementById('res-scientific-name');
    const resVarieties = document.getElementById('res-varieties');
    const resInfo = document.getElementById('res-info');
    const resClimateNeeds = document.getElementById('res-climate-needs');
    const resIdealConditions = document.getElementById('res-ideal-conditions');
    const resSoil = document.getElementById('res-soil');
    const resPlacesIndia = document.getElementById('res-places-india');
    const resPastWeather = document.getElementById('res-past-weather');
    const resForecastStrip = document.getElementById('res-forecast-strip');
    const resGrowingSteps = document.getElementById('res-growing-steps');

    let map = null;
    let markersLayer = null;

    const stateCoordinates = {
        "Andhra Pradesh": [15.9129, 79.7400], "Assam": [26.2006, 92.9376], "Bihar": [25.0961, 85.3131], 
        "Chhattisgarh": [21.2787, 81.8661], "Gujarat": [22.2587, 71.1924], "Haryana": [29.0588, 76.0856], 
        "Karnataka": [15.3173, 75.7139], "Kerala": [10.8505, 76.2711], "Madhya Pradesh": [22.9734, 78.6569], 
        "Maharashtra": [19.7515, 75.7139], "Odisha": [20.9517, 85.0985], "Punjab": [31.1471, 75.3412], 
        "Rajasthan": [27.0238, 74.2179], "Tamil Nadu": [11.1271, 78.6569], "Telangana": [18.1124, 79.0193], 
        "Uttar Pradesh": [26.8467, 80.9462], "West Bengal": [22.9868, 87.8550], "Haryana": [29.0588, 76.0856]
    };

    // Tab Logic
    const tabs = document.querySelectorAll('.catalog-tab');
    const panes = document.querySelectorAll('.catalog-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Warning fields
    const warnCropName = document.getElementById('warn-crop-name');

    // --- Form Submission Logic ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const cropNameInput = input.value.trim();
        const cropName = cropNameInput.toLowerCase();
        if (!cropName) return;

        // Hide both areas initially for smooth animation
        resultsArea.classList.add('hidden');
        resCatalog.classList.add('hidden');
        warningArea.classList.add('hidden');

        // Small delay to allow CSS reset before re-triggering animation
        setTimeout(() => {
            if (cropDatabase[cropName]) {
                // Show Data
                const data = cropDatabase[cropName];
                const displayName = cropNameInput.charAt(0).toUpperCase() + cropNameInput.slice(1);
                resCropName.textContent = displayName;
                resSeason.textContent = data.season;
                resTemp.textContent = data.temp;
                resRain.textContent = data.rain;
                resHumidity.textContent = data.humidity;

                // Clear old icons and add new ones
                resIcons.innerHTML = '';
                data.icons.forEach(iconClass => {
                    const i = document.createElement('i');
                    i.className = `fa-solid ${iconClass}`;
                    resIcons.appendChild(i);
                });

                // Populate Catalog Fields
                resScientificName.textContent = data.scientific_name || `${displayName} species`;
                resVarieties.textContent = data.varieties ? data.varieties.join(", ") : "Standard, High-Yield, Drought-Resistant";

                // Generate Rich Extended Placeholder Text (10+ lines equivalent)
                
                // Tab 1: Info -> 2 paragraphs
                resInfo.textContent = `The cultivation of ${displayName} holds profound historical and economic significance globally. Originating thousands of years ago, it has evolved through selective breeding to become a cornerstone of modern agriculture and food security. It is primarily recognized for its high nutritional value, versatility in processing, and adaptability to regional farming practices over centuries of agrarian development.\n\nEconomically, this crop drives major commodity markets and provides livelihoods for millions of farming families worldwide. Modern agronomic practices emphasize sustainable yield improvements, maximizing both the caloric output per hectare while attempting to minimize the exhaustive impact on topsoil. Its physical characteristics usually include a robust root system and a vegetative structure designed to efficiently capture sunlight for rapid photosynthesis during its peak growing season.`;

                // Tab 2: Climate Needs
                resClimateNeeds.textContent = `The specific temperature and moisture parameters for ${displayName} vary significantly across its distinct growth stages. During the initial sowing and germination phase, the soil must maintain a consistent, moderate warmth accompanied by adequate, but not excessive, moisture to ensure a uniform strike rate. Cold snaps during this phase can lead to uneven emergence and stunt initial root development.\n\nAs the crop transitions into the robust vegetative stage, its water demands increase exponentially to support rapid biomass accumulation and leaf expansion. However, during the critical flowering and reproduction phase, excessive rainfall or extremely high humidity can severely impede pollination and encourage fungal proliferation. Finally, the ripening stage requires a pronounced dry spell with higher daytime temperatures, facilitating the natural desiccation process necessary for maximum quality and safe, long-term storage post-harvest.`;

                // Tab 3: Ideal Conditions
                resIdealConditions.textContent = `Optimal cultivation of ${displayName} is deeply dependent on specific geological and pedological conditions. The ideal soil profile is typically a well-drained loam or silty clay loam, characterized by a deep, friable structure that allows for extensive root penetration and excellent moisture retention without becoming waterlogged. The pH level of the soil must be closely monitored and maintained within a slightly acidic to neutral range, usually between 6.0 and 7.2, to ensure maximum macro and micronutrient availability.\n\nTopographically, gently undulating plains or expansive flatlands are preferred to prevent topsoil erosion and allow for uniform water distribution and mechanized farming operations. Geographically, the most productive growing regions for this crop are found in broad temperate or subtropical zones where distinct seasonal variations provide the necessary thermal accumulation (degree days) required to complete its biological lifecycle efficiently.`;

                // Permanent Weather Logic: Cache and Load
                fetchLiveWeather();

                // Map Initialization
                initMap(data.places_in_india);

                // Tab 7: Growing Timeline
                resGrowingSteps.textContent = data.growing_steps || "Timeline data currently compiling from regional agriculture extensions.";

                // Soil Info
                resSoil.textContent = data.suitable_soil || "Prefers well-drained, aerated soils with balanced organic matter.";

                resultsArea.classList.remove('hidden');
                resCatalog.classList.remove('hidden');
            } else {
                // Show Warning
                warnCropName.textContent = input.value;
                warningArea.classList.remove('hidden');
            }
        }, 100);
    });

    // --- Parallax Scrolling Effect ---
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        // Move floating icons based on scroll
        const floatItems = document.querySelectorAll('.float-item');
        floatItems.forEach((item, index) => {
            const speed = (index + 1) * 0.1;
            item.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * speed}deg)`;
        });

        // Very subtle parallax on the about card
        const aboutCard = document.querySelector('.about-card');
        if (aboutCard) {
            const rect = aboutCard.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                aboutCard.style.transform = `translateY(${(rect.top - window.innerHeight / 2) * 0.05}px)`;
            }
        }
    });

    function getFarmingAdvice(code, temp) {
        if (code >= 51 && code <= 67) return "Rain alert: Postpone spraying";
        if (code >= 71) return "Frost risk: Protection needed";
        if (temp > 35) return "Heat stress: Extra irrigation";
        if (code >= 0 && code <= 3) return "Ideal conditions: Sowing/Growth";
        return "Stable: Regular monitoring";
    }

    function renderForecast(daily) {
        resForecastStrip.innerHTML = '';
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        daily.time.forEach((t, i) => {
            const date = new Date(t);
            const dayName = i === 0 ? 'Today' : weekdays[date.getDay()];
            const weatherCode = daily.weathercode[i];
            const maxTemp = daily.temperature_2m_max[i];
            const minTemp = daily.temperature_2m_min[i];

            let iconClass = 'fa-cloud-sun';
            if (weatherCode === 0) iconClass = 'fa-sun';
            else if (weatherCode > 0 && weatherCode < 4) iconClass = 'fa-cloud-sun';
            else if (weatherCode >= 51 && weatherCode < 70) iconClass = 'fa-cloud-rain';
            
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon"><i class="fa-solid ${iconClass}"></i></div>
                <div class="forecast-temp">${Math.round(maxTemp)}° / ${Math.round(minTemp)}°</div>
                <div class="forecast-advice">${getFarmingAdvice(weatherCode, maxTemp)}</div>
            `;
            resForecastStrip.appendChild(card);
        });
    }

    function fetchLiveWeather() {
        const cached = localStorage.getItem('crop_weather_cache');
        if (cached) {
            const data = JSON.parse(cached);
            if (data.daily) renderForecast(data.daily);
            if (data.current) topWeather.innerHTML = `<i class="fa-solid fa-cloud"></i> ${data.current.temp}°C (Saved)`;
        }

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
                const response = await fetch(url);
                const data = await response.json();
                
                const currentTemp = data.current_weather.temperature;
                topWeather.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${currentTemp}°C (Live)`;
                
                renderForecast(data.daily);
                
                // Cache for "Permanent" data
                localStorage.setItem('crop_weather_cache', JSON.stringify({
                    current: { temp: currentTemp },
                    daily: data.daily,
                    timestamp: new Date().getTime()
                }));
            } catch (error) {
                console.error("Weather fetch failed", error);
            }
        });
    }

    function initMap(places) {
        if (!map) {
            map = L.map('map', { scrollWheelZoom: false }).setView([20.5937, 78.9629], 4);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: 'OpenStreetMap'
            }).addTo(map);
            markersLayer = L.layerGroup().addTo(map);
        }

        // Fix leaflet gray tile issue when tab is switched
        setTimeout(() => map.invalidateSize(), 300);

        markersLayer.clearLayers();
        if (!places) return;

        const bounds = [];
        Object.keys(stateCoordinates).forEach(state => {
            if (places.toLowerCase().includes(state.toLowerCase())) {
                const coords = stateCoordinates[state];
                const marker = L.circleMarker(coords, {
                    radius: 10,
                    fillColor: "#00ff88",
                    color: "#00ff88",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.6
                }).addTo(markersLayer);
                
                marker.bindPopup(`<b>${state}</b><br>Suitable growing region`);
                bounds.push(coords);
            }
        });

        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView([20.5937, 78.9629], 4);
        }
    }

    fetchLiveWeather();

});
