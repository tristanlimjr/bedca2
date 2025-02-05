document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:3000/api/users/count/users");
        if (!response.ok) throw new Error("Failed to fetch user count");

        const data = await response.json();
        document.getElementById("totalplayers").textContent = `${data.count} `;
    } catch (error) {
        console.error("Error fetching user count:", error);
        document.getElementById("totalplayers").textContent = "many ";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("playerSearchInput");
    const searchButton = document.getElementById("searchPlayerBtn");
    const resultsContainer = document.getElementById("playerResults");

    searchButton.addEventListener("click", async function () {
        const username = searchInput.value.trim();
        if (username === "") {
            resultsContainer.innerHTML = "<p class='text-warning'>Please enter a username.</p>";
            return;
        }

        resultsContainer.innerHTML = "<p class='text-info'>Searching...</p>";

        try {
            const response = await fetch(`http://localhost:3000/api/users/${username}`);

            if (!response.ok) {
                if (response.status === 404) {
                    resultsContainer.innerHTML = "<p class='text-danger'>User not found.</p>";
                } else {
                    throw new Error("Failed to fetch user data");
                }
                return;
            }

            const player = await response.json();

            resultsContainer.innerHTML = `
                <div class="player-card mx-auto">
                    <h4 class="text-center">Player Found</h4>
                    <table class="table table-sm table-bordered text-center player-table">
                        <tbody>
                            <tr><td><strong>Username:</strong></td><td>${player.username}</td></tr>
                            <tr><td><strong>Level:</strong></td><td>${player.level}</td></tr>
                            <tr><td><strong>Skill Points:</strong></td><td>${player.skillpoints}</td></tr>
                        </tbody>
                    </table>
                </div>`; 
        } catch (error) {
            console.error("Error searching for player:", error);
            resultsContainer.innerHTML = "<p class='text-danger'>Error fetching player data. Try again later.</p>";
        }
    });
});
