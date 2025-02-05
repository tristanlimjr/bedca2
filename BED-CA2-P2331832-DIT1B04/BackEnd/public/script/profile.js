document.addEventListener('DOMContentLoaded', async function () {
    const username = localStorage.getItem('username');
    const user_id = localStorage.getItem('user_id');

    if (!username) {
        console.warn("No username found, redirecting to login.");
        window.location.href = 'login.html';
        return;
    }

    console.log(`Fetching profile data for: ${username}`);

    // Fetch User Info
    try {
        const response = await fetch(`http://localhost:3000/api/users/${username}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const user = await response.json();
        console.log("User data received:", user);

        document.getElementById('user-username').textContent = `@${(user.username)}` || "N/A";
        document.getElementById('user-email').textContent = user.email || "N/A";
        document.getElementById('user-skillpoints').textContent = user.skillpoints ?? "N/A";
        document.getElementById('user-level').textContent = user.level ?? "N/A";
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }

    // Fetch Active Quests
    try {
        const response = await fetch(`http://localhost:3000/api/quest`);
        if (!response.ok) throw new Error("Failed to fetch quests");

        const quests = await response.json();
        console.log("Quests received:", quests);

        const questList = document.getElementById('quest-list');
        questList.innerHTML = "";
        quests.forEach(quest => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `${quest.quest_name} - ${quest.reward_points} Points`;
            questList.appendChild(li);
        });

    } catch (error) {
        console.error("Error fetching quests:", error);
    }

    // Fetch Completed Challenges
    try {
        const response = await fetch(`http://localhost:3000/api/challenges/${user_id}/completed-challenges`);
        if (!response.ok) throw new Error("Failed to fetch completed challenges");
    
        const completedChallenges = await response.json();
        console.log("Completed Challenges received:", completedChallenges);
    
        const challengeTable = document.getElementById('completed-challenges');
        challengeTable.innerHTML = "";
    
        completedChallenges.forEach(challenge => {
            const row = document.createElement('tr');
    
            row.innerHTML = `
                <td>${challenge.challenge}</td>
                <td>${challenge.notes}</td>
                <td>${challenge.skillpoints}</td>
            `;
    
            challengeTable.appendChild(row);
        });
    
    } catch (error) {
        console.error("Error fetching completed challenges:", error);
    }
    
    // Fetch Inventory
    try {
        const response = await fetch(`http://localhost:3000/api/i/inventory/${user_id}`);
    
        if (!response.ok) {
            throw new Error(`Failed to fetch inventory: ${response.status} ${response.statusText}`);
        }
    
        const inventory = await response.json();
        const inventoryList = document.getElementById('inventory-list');
        inventoryList.innerHTML = "";
    
        if (!Array.isArray(inventory) || inventory.length === 0) {
            console.warn("No inventory found for user.");
            inventoryList.innerHTML = `<li class="list-group-item text-muted">No items in inventory.</li>`;
            // **DO NOT RETURN HERE!** Let the rest of the script execute.
        } else {
            inventory.sort((a, b) => a.item_type.localeCompare(b.item_type));
    
            const itemColors = {
                "Weapon": "bg-danger text-white",
                "Equipment": "bg-primary text-white",
                "Utility": "bg-success text-white",
                "Resource": "bg-warning text-dark",
                "Artifact": "bg-info text-dark"
            };
    
            let lastItemType = null;
    
            inventory.forEach(item => {
                console.log(`Processing item: ${item.item_name} (${item.item_type}) - Quantity: ${item.quantity}`);
    
                if (item.item_type !== lastItemType) {
                    const header = document.createElement('li');
                    header.classList.add('list-group-item', 'fw-bold', 'text-uppercase', 'bg-secondary', 'text-white');
                    header.textContent = item.item_type;
                    inventoryList.appendChild(header);
                    lastItemType = item.item_type;
                }
    
                if (!item.item_name || item.quantity === undefined) {
                    console.warn(`Skipping invalid item:`, item);
                    return;
                }
    
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    
                if (itemColors[item.item_type]) {
                    li.classList.add(...itemColors[item.item_type].split(" "));
                } else {
                    li.classList.add("bg-light");
                }
    
                li.innerHTML = `
                    <strong>${item.item_name}</strong>
                    <span class="badge bg-dark rounded-pill">${item.quantity}</span>
                `;
    
                inventoryList.appendChild(li);
            });
        }
    
    } catch (error) {
        console.error("Error loading inventory:", error);
    }

     try {
        const response = await fetch(`http://localhost:3000/api/colony/user/${user_id}`);
    
        if (!response.ok) throw new Error("Failed to fetch colony info");
    
        const colonies = await response.json();
        console.log("Colony data received:", colonies);
    
        const colonyContainer = document.getElementById('colony-container');
    
        colonyContainer.innerHTML = "";
    
        if (Array.isArray(colonies) && colonies.length > 0) {
            colonies.forEach(colony => {
                const colonyCard = document.createElement('div');
                colonyCard.classList.add('card', 'mb-4');
    
                colonyCard.innerHTML = `
                    <div class="colony card-header bg-info text-black">Colony Information</div>
                    <div class="card-body">
                        <p>Colony Name: <span>${colony.colony_name}</span></p>
                        <p>Planet: <span>${colony.planet_name}</span></p>
                        <p>Population: <span>${colony.population}</span></p>
                        <p>Resources Generated: <span>${colony.resources_generated}</span></p>
                        <p>Defense Level: <span>${colony.defense_level}</span></p>
                    </div>
                `;
    
                colonyContainer.appendChild(colonyCard);
            });
        } else {
            colonyContainer.innerHTML = "<p>No colonies found.</p>";
        }
    } catch (error) {
        console.error("Error fetching colony info:", error);
        document.getElementById('colony-container').innerHTML = "<p>No Colonies found</p>";
    }
    
    

    // Fetch Party Info
    try {
        const partyIdResponse = await fetch(`http://localhost:3000/api/party/user/${user_id}`);
        if (!partyIdResponse.ok) throw new Error("Failed to fetch party ID");

        const partyData = await partyIdResponse.json();
        console.log("Party Data:", partyData);

        if (!partyData.party_id) {
            document.getElementById('party-container').innerHTML = "<p>No party found.</p>";
            return;
        }

        const party_id = partyData.party_id;

        const membersResponse = await fetch(`http://localhost:3000/api/party/${party_id}`);
        if (!membersResponse.ok) throw new Error("Failed to fetch party members");

        const partyDetails = await membersResponse.json();
        console.log("Party Members Data:", partyDetails);

        document.getElementById('party-name').textContent = partyDetails.party_name || "N/A";
        document.getElementById('party-leader').textContent = partyDetails.leader || "N/A";

        const partyMembersList = document.getElementById('party-members');
        partyMembersList.innerHTML = "";

        if (partyDetails.members && partyDetails.members.length > 0) {
            partyDetails.members.forEach(member => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = `${member.username}`;
                partyMembersList.appendChild(li);
            });
        } else {
            partyMembersList.innerHTML = "<li class='list-group-item text-muted'>No members found.</li>";
        }
    } catch (error) {
        console.error("Error fetching party data:", error);
        document.getElementById('party-container').innerHTML = "<p>No party found.</p>";
    }
});

// Logout Handler
document.getElementById('logout')?.addEventListener('click', function () {
    console.log("Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
});
