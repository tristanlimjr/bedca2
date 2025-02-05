document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.warn("No token found, redirecting to login.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/protected', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById('welcome-message').textContent = `Welcome, ${user.username}, our bravest explorer. Your cosmic journey begins now. Track your progress, complete challenges, and conquer the stars!`;
        } else {
            console.warn("Invalid token, redirecting to login.");
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const dailyItemElement = document.getElementById("daily-item");
    const claimButton = document.getElementById("claim-item");
    const claimStatus = document.getElementById("claim-status");

    const userId = localStorage.getItem("user_id");
    let storedDailyItem = JSON.parse(localStorage.getItem(`dailyItem_${userId}`));
    let claimedItem = JSON.parse(localStorage.getItem(`claimedItem_${userId}`));
    const now = new Date();
    let selectedItem = null;

    try {
        if (storedDailyItem && storedDailyItem.date === now.toISOString().split("T")[0]) {
            selectedItem = storedDailyItem.item;
        } else {
            const response = await fetch("http://localhost:3000/api/i/items");

            if (!response.ok) {
                throw new Error("Failed to fetch items.");
            }

            const items = await response.json();

            if (!Array.isArray(items) || items.length === 0) {
                throw new Error("No items available.");
            }

            selectedItem = items[Math.floor(Math.random() * items.length)];

            localStorage.setItem(`dailyItem_${userId}`, JSON.stringify({
                item: selectedItem,
                date: now.toISOString().split("T")[0]
            }));
        }

        dailyItemElement.textContent = `Today's free item: ${selectedItem.item_name} 🎁`;

        if (claimedItem && claimedItem.timestamp) {
            const lastClaimTime = new Date(claimedItem.timestamp);
            const timeDiff = now - lastClaimTime; 
            const hoursPassed = timeDiff / (1000 * 60 * 60);

            if (hoursPassed < 24) {
                claimButton.disabled = true;
                const hoursRemaining = Math.ceil(24 - hoursPassed);
                claimStatus.textContent = `You have already claimed today's item! Next item in ${hoursRemaining} hours.`;
            } else {
                claimButton.disabled = false;
            }
        } else {
            claimButton.disabled = false;
        }

    } catch (error) {
        dailyItemElement.textContent = "Failed to load daily item.";
        console.error("Error fetching daily item:", error);
    }

    claimButton.addEventListener("click", async function () {
        if (!selectedItem) return;
        if (!userId) {
            alert("User not logged in.");
            return;
        }

        try {
            const claimResponse = await fetch("http://localhost:3000/api/i/inventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userId,
                    item_id: selectedItem.item_id,
                    quantity: 1
                })
            });

            if (!claimResponse.ok) {
                throw new Error("Failed to claim the item.");
            }

            localStorage.setItem(`claimedItem_${userId}`, JSON.stringify({
                item: selectedItem,
                timestamp: new Date().toISOString()
            }));

            claimStatus.textContent = "Item claimed successfully! Come back in 24 hours.";
            claimButton.disabled = true;

        } catch (error) {
            claimStatus.textContent = "Failed to claim item.";
            console.error("Error claiming item:", error);
        }
    });
});

document.addEventListener('click', function(event) {
    const logoutButton = document.getElementById('logout');
    if (event.target === logoutButton) {
        console.log("Logging out...");
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});