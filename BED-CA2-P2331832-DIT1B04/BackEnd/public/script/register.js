document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('register-message');

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = 'green';
            message.textContent = "Registration successful! Redirecting to login...";
            setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
            message.style.color = 'red';
            message.textContent = data.message || "Registration failed. Try again.";
        }
    } catch (error) {
        console.error("Registration Error:", error);
        message.style.color = 'red';
        message.textContent = "Something went wrong. Try again.";
    }
});

document.getElementById('loginButton').addEventListener('click', function() {
    window.location.href = 'login.html';
});