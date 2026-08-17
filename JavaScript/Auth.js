document.addEventListener('DOMContentLoaded', () => {
    
    const btnLogin = document.getElementById('btn-login');
    const btnSignup = document.getElementById('btn-signup');
    const formLogin = document.getElementById('login-form');
    const formSignup = document.getElementById('signup-form');

    btnLogin.addEventListener('click', () => {
        btnLogin.classList.add('active');
        btnSignup.classList.remove('active');
        formLogin.classList.remove('hidden-form');
        formSignup.classList.add('hidden-form');
    });

    btnSignup.addEventListener('click', () => {
        btnSignup.classList.add('active');
        btnLogin.classList.remove('active');
        formSignup.classList.remove('hidden-form');
        formLogin.classList.add('hidden-form');
    });
    // Login
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageBox = document.getElementById('login-message');
            messageBox.style.color = '#ccc';
            messageBox.textContent = 'Verifying credentials...';

            const formData = {
                email: document.getElementById('login-email').value,
                password: document.getElementById('login-password').value
            };

            try {
                const response = await fetch('../PHP/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.status === 'success') {
                    messageBox.style.color = '#dfb96f';
                    messageBox.textContent = 'Welcome back, ' + result.name + '! Redirecting...';
                    
                    setTimeout(() => {
                        window.location.href = 'Webpage.html';
                    }, 1000);

                } else {
                    messageBox.style.color = '#ff6b6b'; 
                    messageBox.textContent = result.message;
                }
            } catch (error) {
                console.error("Login Error:", error);
                messageBox.style.color = '#ff6b6b';
                messageBox.textContent = 'A network error occurred.';
            }
        });
    }
    //Sign- UP
    if (formSignup) {
        formSignup.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageBox = document.getElementById('auth-message');
            messageBox.style.color = '#ccc';
            messageBox.textContent = 'Creating account...';

            const formData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            };

            try {
                const response = await fetch('../PHP/register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.status === 'success') {
                    messageBox.style.color = '#dfb96f';
                    messageBox.textContent = result.message;
                    formSignup.reset(); 
                
                    setTimeout(() => {
                        btnLogin.click();
                        document.getElementById('login-email').value = formData.email;
                        document.getElementById('login-message').textContent = 'Account created! Please log in.';
                    }, 2000);

                } else {
                    messageBox.style.color = '#ff6b6b';
                    messageBox.textContent = result.message;
                }
            } catch (error) {
                console.error("Registration Error:", error);
                messageBox.style.color = '#ff6b6b';
                messageBox.textContent = 'A network error occurred.';
            }
        });
    }
});