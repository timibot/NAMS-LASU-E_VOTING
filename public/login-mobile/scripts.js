// login-scripts.js

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('form-message');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            // Prevent the form from reloading the page
            event.preventDefault();

            const matricNumber = document.getElementById('matric-no').value;
            const password = document.getElementById('password').value;

            messageDiv.textContent = 'Logging in...';
            messageDiv.style.color = 'gray';

            // This fetch call sends the login data to your backend
            fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    matric_number: matricNumber,
                    password: password,
                }),
            })
            .then(response => {
                // Check if the server responded with a success status (e.g., 200 OK)
                if (response.ok) {
                    return response.json();
                } else {
                    // If credentials are bad, the server likely sent a 400 or 401 error
                    throw new Error('Invalid Credentials');
                }
            })
            .then(data => {
                console.log('Login success:', data);
                
                // On a successful login, the user is redirected to the voting page
                window.location.href = 'vote.html';
            })
            .catch(error => {
                // This will catch network errors or the 'Invalid Credentials' error from above
                console.error('Login error:', error);
                messageDiv.textContent = 'Login failed. Please check your matric number and password.';
                messageDiv.style.color = 'red';
            });
        });
    }
});