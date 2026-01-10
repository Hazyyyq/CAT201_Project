import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import styles from '../style/AuthPage.module.css';

const SignupPage = () => {
    const navigate = useNavigate(); // Hook to move user to Login page after success

    // 1. STATE: Store the input values
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // 2. HANDLER: Update state when user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 3. SUBMIT: Send data to Java Backend
    const handleSignup = async (e) => {
        e.preventDefault(); // Stop page refresh

        // Basic Validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Note: Use your Render URL if deployed, or localhost if testing locally
            const response = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Map form data to your Java User class fields (name, email, password)
                body: JSON.stringify({
                    name: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                alert("Account created successfully!");
                navigate('/login'); // Redirect to login page
            } else {
                const data = await response.json();
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Could not connect to server.");
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
                {/* 4. Connect the form to the handler */}
                <form onSubmit={handleSignup}>
                    <h1>Sign Up</h1>

                    <div className={styles['input-box']}>
                        <input
                            type="username"
                            name="username" // Name matches state key
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.btn}>
                        Register
                    </button>

                    <div className={styles['register-link']}>
                        <p>
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SignupPage;