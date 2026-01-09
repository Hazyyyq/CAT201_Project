import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/CartPage.module.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('kakiCart')) || [];
        setCartItems(storedCart);
        calculateTotal(storedCart);
    };

    const calculateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + item.price, 0);
        setTotalPrice(total);
    };

    const removeItem = (index) => {
        const updatedCart = [...cartItems];
        updatedCart.splice(index, 1);
        setCartItems(updatedCart);
        calculateTotal(updatedCart);
        localStorage.setItem('kakiCart', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        localStorage.removeItem('kakiCart');
        setCartItems([]);
        setTotalPrice(0);
    };

    const handleCheckout = () => {
        alert("Proceeding to Payment Gateway...");
    };

    return (
        <div className={styles.pageWrapper}>

            <nav className="nav">
                <Link to="/" className="logo">
                    KAKI GAMERZ<span className="dot"></span>
                </Link>

                <div className="nav-actions">
                    <div className="nav-links desktop-menu">
                        <Link to="/">Continue Shopping</Link>
                    </div>

                    <div className="sidebar" onClick={() => setIsOpen(!isOpen)}>
                        <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
                    </div>
                </div>
            </nav>

            <div className={`mobile-nav-overlay ${isOpen ? 'active' : ''}`}>
                <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/" onClick={() => setIsOpen(false)}>Continue Shopping</Link>
            </div>

            <div className={styles['cart-container']}>
                <h1 className={styles['cart-title']}>Review your bag.</h1>

                <div id="cart-items">
                    {cartItems.length === 0 ? (
                        <p className={styles['empty-msg']}>Your bag is empty.</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className={styles['cart-item']}>
                                <img src={item.img} alt={item.name} />
                                <div className={styles['item-info']}>
                                    <div className={styles['item-name']}>{item.name}</div>
                                    <div className={styles['item-details']}>
                                        Color: {item.color} | Spec: {item.size}
                                    </div>
                                    <button
                                        className={styles['remove-btn']}
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className={styles['item-price']}>RM {item.price}</div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className={styles['total-section']}>
                        <p>Total: <span id="cart-total">RM {totalPrice.toFixed(2)}</span></p>

                        <button className={styles['checkout-btn']} onClick={handleCheckout}>
                            Check Out
                        </button>

                        <button className={styles['clear-btn']} onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;