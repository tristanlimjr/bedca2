const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}
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

        if (!response.ok) {
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