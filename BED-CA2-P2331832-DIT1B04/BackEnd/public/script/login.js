document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username)
            localStorage.setItem('user_id', data.user_id);
            window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = data.message || "Invalid login credentials.";
        }
    } catch (error) {
        console.error("Login Error:", error);
        errorMessage.textContent = "Something went wrong. Try again.";
    }
});

document.getElementById('registerButton').addEventListener('click', function() {
    window.location.href = 'register.html';
});
