document.addEventListener("DOMContentLoaded", async function () {
    const challengesContainer = document.getElementById("challengesContainer");
    const challengeTitleInput = document.getElementById("challengeTitle");
    const challengeSkillPointsInput = document.getElementById("challengeSkillPoints");
    const submitChallengeButton = document.getElementById("submitChallenge");
    const challengeMessage = document.getElementById("challengeMessage");

    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    if (!user_id || !token) {
        alert("You must be logged in to view and create challenges.");
        return;
    }

    async function loadChallenges() {
        try {
            console.log("Fetching challenges...");
            
            if (!user_id) {
                console.error("Error: user_id is undefined. Make sure the user is logged in.");
                return;
            }
    
            const response = await fetch("http://localhost:3000/api/challenges", {
                headers: { "Authorization": `Bearer ${token}` }
            });
    
            if (!response.ok) throw new Error("Failed to fetch challenges");
            const challenges = await response.json();
            console.log("Challenges Data:", challenges);
    
            console.log(`Fetching completed challenges for user ${user_id}...`);
    
            const userChallengesResponse = await fetch(`http://localhost:3000/api/challenges/${user_id}/completed-challenges`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
    
            let completedChallenges = new Set();
    
            if (userChallengesResponse.ok) {
                const userChallenges = await userChallengesResponse.json();
                console.log("Completed Challenges Data:", userChallenges);
                completedChallenges = new Set(userChallenges.map(ch => ch.challenge_id));
            } else {
                console.warn("User has no completed challenges.");
            }
    
            challengesContainer.innerHTML = "";
    
            if (challenges.length === 0) {
                challengesContainer.innerHTML = `<p class="text-center text-warning">No challenges available.</p>`;
                return;
            }
    
            challenges.forEach(challenge => {
                const challengeElement = document.createElement("div");
                challengeElement.classList.add("col-md-4", "mb-4");
    
                challengeElement.innerHTML = `
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${challenge.challenge}</h5>
                            <p class="card-text"><strong>Skill Points:</strong> ${challenge.skillpoints}</p>
                            <button class="btn btn-success take-challenge" data-id="${challenge.challenge_id}"
                                ${completedChallenges.has(challenge.challenge_id) ? "disabled" : ""}>
                                ${completedChallenges.has(challenge.challenge_id) ? "Completed" : "Take Challenge"}
                            </button>
                        </div>
                    </div>
                `;
                challengesContainer.appendChild(challengeElement);
            });
    
            document.querySelectorAll(".take-challenge").forEach(button => {
                button.addEventListener("click", takeChallenge);
            });
    
        } catch (error) {
            console.error("Error loading challenges:", error);
        }
    }
    
            

    async function takeChallenge(event) {
        const challengeId = parseInt(event.target.getAttribute("data-id"), 10);
    
        if (!confirm("Are you sure you want to take on this challenge?")) return;
    
        let notes = prompt("Enter any notes or motivation for this challenge:");
        if (notes === null) return; 
    
        notes = notes.trim() === "" ? "No notes provided" : notes;
    
        const formattedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    
        const completedStatus = Math.random() < 0.5;
    
        const requestData = {
            user_id: user_id, 
            challenge_id: challengeId,
            completed: completedStatus,
            creation_date: formattedDate,
            notes: notes 
        };
    
        console.log("Sending challenge data:", requestData);
    
        try {
            const response = await fetch(`http://localhost:3000/api/challenges/${challengeId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });
    
            if (!response.ok) throw new Error("Failed to take on challenge");
            alert(`Challenge started! Status: ${completedStatus ? "Completed" : "In Progress"}`);
            loadChallenges();
        } catch (error) {
        }
    }
    

    submitChallengeButton.addEventListener("click", async function () {
        const challengeTitle = challengeTitleInput.value.trim();
        let skillpoints = parseInt(challengeSkillPointsInput.value, 10);

        if (challengeTitle === "" || isNaN(skillpoints)) {
            challengeMessage.innerHTML = `<p class="text-warning">Please enter a valid title and skill points.</p>`;
            return;
        }
    
        if (skillpoints > 400) {
            challengeMessage.innerHTML = `<p class="text-danger">Skill points cannot exceed 400.</p>`;
            return;
        }
    
        const requestData = {
            challenge: challengeTitle,
            user_id: user_id,
            skillpoints: parseInt(skillpoints)
        };
    
        console.log("Submitting Challenge Data:", requestData);
    
        try {
            const response = await fetch("http://localhost:3000/api/challenges", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });
    
            const responseText = await response.text();
            console.log("API Response:", responseText);
    
            if (!response.ok) throw new Error(responseText);
    
            challengeMessage.innerHTML = `<p class="text-success">Challenge created successfully!</p>`;
            challengeTitleInput.value = "";
            challengeSkillPointsInput.value = "";
            
            loadChallenges();
        } catch (error) {
            console.error("Error creating challenge:", error);
            challengeMessage.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
        }
        
    });

    loadChallenges();
});
// Logout Handler
document.getElementById('logout')?.addEventListener('click', function () {
    console.log("Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
});
