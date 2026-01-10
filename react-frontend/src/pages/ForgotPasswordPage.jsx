import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../style/AuthPage.module.css';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    // 1. STATE: Store input values
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    newPassword: formData.newPassword
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Success! Your password has been changed.");
                navigate('/login');
            } else {
                alert("Error: " + data.message);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to server.");
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
                <form onSubmit={handleSubmit}>
                    {/* Reuse the gamer font title */}
                    <h1>Reset Password</h1>

                    <div className={styles['input-box']}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <i className='bx bxs-envelope'></i>
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <i className='bx bxs-lock-alt'></i>
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <i className='bx bxs-lock'></i>
                    </div>

                    <button type="submit" className={styles.btn}>
                        Update Password
                    </button>

                    <div className={styles['register-link']}>
                        <p>
                            Remembered it? <Link to="/login">Login</Link>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage