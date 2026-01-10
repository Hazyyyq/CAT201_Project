import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../style/AuthPage.module.css';

const LoginPage = () => {
    const navigate = useNavigate();

    // 1. STATE: Track email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 2. HANDLER: Send credentials to Java Backend
    const handleLogin = async (e) => {
        e.preventDefault(); // Stop page refresh

        try {
            // Use 127.0.0.1 to match your working Signup configuration
            const response = await fetch('http://127.0.0.1:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                // A. Parse the User Data sent back by Java
                const userData = await response.json();

                // B. Save to Local Storage (This logs them in!)
                localStorage.setItem('currentUser', JSON.stringify(userData));

                // C. Redirect to Home (or Admin Dashboard if they are admin)
                if (userData.role === 'admin') {
                    // navigate('/admin'); // Uncomment this later when you have an admin route
                    alert("Welcome Admin!");
                    navigate('/');
                } else {
                    alert("Login Successful!");
                    navigate('/');
                }

                // Optional: Force a page reload to update the Navbar immediately
                window.location.reload();

            } else {
                alert("Invalid email or password.");
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("Server not responding. Is Main.java running?");
        }
    };

    return (
        <div className={styles.loginContainer}>

            <nav className={styles.navbar}>
                <Link to="/" className={styles.homeLink}>
                    <i className='bx bx-left-arrow-alt'></i> Home
                </Link>
            </nav>

            <div className={styles.wrapper}>
                {/* Connect Handler */}
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>

                    <div className={styles['input-box']}>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            // Connect State
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <i className="bx bxs-user"></i>
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            // Connect State
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i className="bx bxs-lock-alt"></i>
                    </div>

                    <div className={styles['remember-forgot']}>
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button type="submit" className={styles.btn}>
                        Login
                    </button>

                    <div className={styles['register-link']}>
                        <p>
                            Dont have an account? <Link to="/signup">Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;