document.addEventListener('DOMContentLoaded', function () {
    // --- REGISTRATION FORM LOGIC ---
    const registrationForm = document.getElementById('registration-form');
    const messageDiv = document.getElementById('form-message');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const fullName = document.getElementById('name').value;
            const matricNumber = document.getElementById('matric-no').value;
            const password = document.getElementById('password').value;

            messageDiv.textContent = 'Registering...';
            messageDiv.style.color = 'gray';

            fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: fullName,
                    matric_number: matricNumber,
                    password: password,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.matric_number) {
                    messageDiv.textContent = 'Registration successful! Redirecting to login...';
                    messageDiv.style.color = 'green';
                    
                    // Wait 2 seconds, then redirect to the login page
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);

                } else {
                    let errorMessage = 'Registration failed: ';
                    for (const key in data) {
                        errorMessage += `${key}: ${data[key].join(', ')} `;
                    }
                    messageDiv.textContent = errorMessage;
                    messageDiv.style.color = 'red';
                }
            })
            .catch((error) => {
                console.error('Fetch Error:', error);
                messageDiv.textContent = 'An error occurred. Please check your connection and try again.';
                messageDiv.style.color = 'red';
            });
        });
    }
});