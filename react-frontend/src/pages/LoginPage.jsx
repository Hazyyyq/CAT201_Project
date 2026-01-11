import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../style/AuthPage.module.css';
import { API_BASE_URL } from '../config';

const LoginPage = () => {
    const navigate = useNavigate();

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    const handleLogin = async (e) => {
        e.preventDefault(); 

        try {
            
            const response = await fetch(`${API_BASE_URL}/api/login`, {
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
                
                const userData = await response.json();

                
                localStorage.setItem('currentUser', JSON.stringify(userData));

                
                if (userData.role === 'admin') {
                    
                    alert("Welcome Admin!");
                    navigate('/');
                } else {
                    alert("Login Successful!");
                    navigate('/');
                }

                
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
                
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>

                    <div className={styles['input-box']}>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            
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
                            
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i className="bx bxs-lock-alt"></i>
                    </div>

                    <div className={styles['remember-forgot']}>
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <Link to="/forgot-password">Forgot Password?</Link>
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
