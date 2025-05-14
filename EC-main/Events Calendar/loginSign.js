document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('loginLink');
    const signupBtn = document.getElementById('signupLink');
    const overlay = document.getElementById('overlay');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const closeButtons = document.querySelectorAll('.close-modal');
    const logoutBtn = document.getElementById('logoutLink');

    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal(loginModal);
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal(registerModal);
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            hideModals();
        });
    }

    if (closeButtons) {
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                hideModals();
            });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('includes/auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'logout' })
                });

                const result = await response.json();
                if (result.success) {
                    updateUIAfterLogout();
                    showToast('Logged out successfully!');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Logout error:', error);
                showToast('Logout failed', 'error');
            }
        });
    }

    // Form Submissions
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = {
                action: 'login',
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('includes/auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    hideModals();
                    updateUIAfterLogin(result.user);
                    showToast('Login successful!');
                    window.location.reload();
                } else {
                    showToast(result.error || 'Login failed', 'error');
                }
            } catch (error) {
                showToast('An error occurred', 'error');
                console.error('Login error:', error);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = {
                action: 'register',
                academic_id: formData.get('academic_id'),
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            // Client-side validation
            if (data.password.length < 8) {
                showToast('Password must be at least 8 characters', 'error');
                return;
            }

            try {
                const response = await fetch('includes/auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    hideModals();
                    showToast('Registration successful! Please login.');
                    // Auto switch to login modal
                    showModal(loginModal);
                    registerForm.reset();
                } else {
                    showToast(result.error || 'Registration failed', 'error');
                }
            } catch (error) {
                showToast('An error occurred', 'error');
                console.error('Registration error:', error);
            }
        });
    }

    // Check session on page load
    checkSession();

    // Helper Functions
    function showModal(modal) {
        if (overlay) overlay.classList.remove('hidden');
        if (modal) modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideModals() {
        if (overlay) overlay.classList.add('hidden');
        if (loginModal) loginModal.classList.add('hidden');
        if (registerModal) registerModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    async function checkSession() {
        try {
            const response = await fetch('includes/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'check_session' })
            });
            
            const result = await response.json();

            if (result.success) {
                updateUIAfterLogin(result.user);
            } else {
                updateUIAfterLogout();
            }
        } catch (error) {
            console.error('Session check error:', error);
        }
    }

    function updateUIAfterLogin(user) {
        // Hide login/signup buttons
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        
        // Show logout button
        if (logoutBtn) logoutBtn.style.display = 'block';
        
        // Update user info if you have an element for it
        const userInfoElement = document.getElementById('userInfo');
        if (userInfoElement) {
            userInfoElement.textContent = `Welcome, ${user.username}`;
            userInfoElement.style.display = 'block';
        }
    }

    function updateUIAfterLogout() {
        // Show login/signup buttons
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        
        // Hide logout button
        if (logoutBtn) logoutBtn.style.display = 'none';
        
        // Clear user info if you have an element for it
        const userInfoElement = document.getElementById('userInfo');
        if (userInfoElement) {
            userInfoElement.style.display = 'none';
        }
    }

    function showToast(message, type = 'success') {
        // Create toast element if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.position = 'fixed';
            toastContainer.style.bottom = '20px';
            toastContainer.style.right = '20px';
            toastContainer.style.zIndex = '1000';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.padding = '10px 20px';
        toast.style.margin = '10px 0';
        toast.style.borderRadius = '4px';
        toast.style.color = 'white';
        toast.style.backgroundColor = type === 'error' ? '#f44336' : '#4CAF50';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        toast.style.animation = 'slideIn 0.5s, fadeOut 0.5s 2.5s';
        
        toastContainer.appendChild(toast);
        
        // Remove toast after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});