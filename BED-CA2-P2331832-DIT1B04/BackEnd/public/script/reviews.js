document.addEventListener("DOMContentLoaded", async function () {
    const reviewForm = document.getElementById("reviewForm");
    const reviewsContainer = document.getElementById("reviewsContainer");
    const showMyReviewsBtn = document.getElementById("showMyReviews");
    const showAllReviewsBtn = document.getElementById("showAllReviews");

    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    async function loadChallenges() {
        try {
            const response = await fetch("http://localhost:3000/api/challenges");
            if (!response.ok) throw new Error("Failed to fetch challenges");

            const challenges = await response.json();
            const challengeSelect = document.getElementById("challengeId");
            challengeSelect.innerHTML = '<option value="">Select Challenge</option>';

            challenges.forEach(challenge => {
                const option = document.createElement("option");
                option.value = challenge.challenge_id ? challenge.challenge_id.toString() : "";
                option.textContent = challenge.challenge;
                challengeSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading challenges:", error);
        }
    }

    async function loadReviews(url = "http://localhost:3000/api/review") {
        try {
            const [reviewsResponse, usersResponse, challengesResponse] = await Promise.all([
                fetch(url, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("http://localhost:3000/api/users"),
                fetch("http://localhost:3000/api/challenges")
            ]);

            if (!reviewsResponse.ok || !usersResponse.ok || !challengesResponse.ok) {
                throw new Error("Failed to fetch data");
            }

            const [reviews, users, challenges] = await Promise.all([
                reviewsResponse.json(),
                usersResponse.json(),
                challengesResponse.json()
            ]);

            const usersMap = Object.fromEntries(users.map(user => [user.user_id, user.username]));
            const challengesMap = Object.fromEntries(challenges.map(challenge => [challenge.challenge_id, challenge.challenge]));

            reviewsContainer.innerHTML = "";

            reviews.forEach(review => {
                const username = usersMap[review.user_id] || "Unknown User";
                const challengeName = challengesMap[review.challenge_id] || "Unknown Challenge";

                const reviewElement = document.createElement("div");
                reviewElement.classList.add("card", "p-3", "mb-3", "shadow-sm");
                reviewElement.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${username} - <small>${challengeName}</small></h5>
                        <p class="card-text">Rating: ${'⭐'.repeat(review.rating)}</p>
                        <p class="card-text">${review.comment}</p>
                        ${review.user_id.toString() === user_id.toString() ? `
                            <button class="btn btn-warning btn-sm edit-review" data-id="${review.review_id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-review" data-id="${review.review_id}">Delete</button>
                        ` : ""}
                    </div>
                `;
                reviewsContainer.appendChild(reviewElement);
            });

            document.querySelectorAll(".edit-review").forEach(button => {
                button.addEventListener("click", editReview);
            });

            document.querySelectorAll(".delete-review").forEach(button => {
                button.addEventListener("click", deleteReview);
            });
        } catch (error) {
            console.error("Error loading reviews:", error);
        }
    }

    async function submitReview(event) {
        event.preventDefault();

        if (!token) {
            alert("You must be logged in to submit a review.");
            return;
        }

        const challengeId = document.getElementById("challengeId").value;
        const rating = document.getElementById("rating").value;
        const reviewText = document.getElementById("reviewText").value;

        if (!challengeId || !rating || !user_id) {
            alert("Please select a valid challenge, rating, and ensure you're logged in.");
            return;
        }

        const reviewData = {
            user_id: user_id,
            challenge_id: parseInt(challengeId, 10),
            rating: parseInt(rating, 10),
            comment: reviewText
        };

        try {
            const response = await fetch("http://localhost:3000/api/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) throw new Error("Failed to submit review");
            alert("Review submitted successfully!");
            reviewForm.reset();
            loadReviews();
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    async function editReview(event) {
        const reviewId = event.target.getAttribute("data-id");
    
        let newRating = prompt("Update your rating (1-5):");
        newRating = parseInt(newRating, 10);
        
        const newComment = prompt("Edit your review comment:");
        if (!newComment) return;
        
        if (isNaN(newRating) || newRating < 1 || newRating > 5) {
            alert("Invalid rating. Please enter a number between 1 and 5.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/api/review/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    comment: newComment,
                    rating: newRating
                })
            });
    
            if (!response.ok) throw new Error("Failed to update review");
            alert("Review updated successfully!");
            loadReviews();
        } catch (error) {
            console.error("Error updating review:", error);
        }
    }
    

    async function deleteReview(event) {
        const reviewId = event.target.getAttribute("data-id");
        const confirmDelete = confirm("Are you sure you want to delete this review?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/api/review/${reviewId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to delete review");
            alert("Review deleted successfully!");
            loadReviews();
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    }

    showMyReviewsBtn.addEventListener("click", function () {
        loadReviews(`http://localhost:3000/api/review/users/${user_id}`);
        showMyReviewsBtn.classList.add("d-none");
        showAllReviewsBtn.classList.remove("d-none");
    });

    showAllReviewsBtn.addEventListener("click", function () {
        loadReviews();
        showAllReviewsBtn.classList.add("d-none");
        showMyReviewsBtn.classList.remove("d-none");
    });

    reviewForm.addEventListener("submit", submitReview);
    loadChallenges();
    loadReviews();
});
// Logout Handler
document.getElementById('logout')?.addEventListener('click', function () {
    console.log("Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
});
