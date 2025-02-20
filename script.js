document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("loginPopup");
    const closeBtn = document.querySelector(".close-btn");
    const loginForm = document.querySelector(".form");
    const searchBtn = document.getElementById("searchBtn"); 
    const searchInput = document.getElementById("searchInput"); 
    const resultsContainer = document.getElementById("results");

    function closePopup() {
        popup.classList.add("hidden");
        setTimeout(() => {
            popup.style.display = "none";
        }, 300);
    }

    closeBtn.addEventListener("click", closePopup);
    window.addEventListener("click", function (event) {
        if (event.target === popup) {
            closePopup();
        }
    });

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("https://reqres.in/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                alert("Login successful! Token: " + data.token);
                closePopup();
            } else {
                alert("Login failed: " + data.error);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
    });

    window.handleCredentialResponse = function (response) {
        console.log("Google JWT Token:", response.credential);

        fetch("YOUR_BACKEND_URL", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.credential }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Google Login successful! Welcome " + data.user.name);
                closePopup();
            } else {
                alert("Google Login failed.");
            }
        })
        .catch(error => console.error("Error:", error));
    };

    searchBtn.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query === "") {
            alert("Please enter an anime name.");
            return;
        }
    
        fetch(`https://api.jikan.moe/v4/anime?q=${query}`)
            .then(response => response.json())
            .then(data => {
                resultsContainer.innerHTML = "";
                if (data.data.length > 0) {
                    data.data.forEach(anime => {
                        const animeElement = document.createElement("div");
                        animeElement.classList.add("anime-result");
                        animeElement.innerHTML = `
                            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                            <div>
                                <h3>${anime.title}</h3>
                                <p>${anime.synopsis ? anime.synopsis.substring(0, 100) + "..." : "No synopsis available."}</p>
                            </div>
                        `;
                        resultsContainer.appendChild(animeElement);
                    });
                } else {
                    resultsContainer.innerHTML = "<p>No results found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching anime:", error);
                resultsContainer.innerHTML = "<p>Error fetching anime data.</p>";
            });
    });
    
});
