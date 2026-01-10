import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/CartPage.module.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cartCount, setCartCount] = useState(0); // Added for Nav Badge
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const storedCart = JSON.parse(localStorage.getItem('kakiCart')) || [];
        setCartItems(storedCart);
        setCartCount(storedCart.length); // Update Badge
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
        setCartCount(updatedCart.length); // Update Badge
        calculateTotal(updatedCart);
        localStorage.setItem('kakiCart', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        localStorage.removeItem('kakiCart');
        setCartItems([]);
        setCartCount(0); // Update Badge
        setTotalPrice(0);
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("INVENTORY ALREADY EMPTY");
            return;
        }

        try {
            // 1. Send the cart data to your Java CheckoutServlet
            const response = await fetch('http://localhost:8080/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartItems })
            });

            if (response.ok) {
                // 2. Only if the server confirms success, show alert and clear the cart
                alert("PAYMENT VERIFIED: SYSTEM STOCK UPDATED");

                // This function already clears localStorage and resets the state
                clearCart();
            } else {
                alert("TRANSACTION ERROR: SERVER REJECTED REQUEST");
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            alert("CRITICAL ERROR: CONNECTION TO BACKEND LOST");
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Background Layers for Theme Continuity */}
            <div className={styles.bgGrid}></div>
            <div className={styles.bgVignette}></div>

            {/* Navigation */}
            <nav className="nav">
                <Link to="/" className="logo">
                    KAKI GAMERZ<span className="dot"></span>
                </Link>

                <div className="nav-actions">
                    <div className="nav-links desktop-menu">
                        <Link to="/">Continue Shopping</Link>
                    </div>

                    {/* Cart Icon with Dynamic Badge */}
                    <Link to="/cart" className="cart-icon-container">
                        <span
                            className="fa-stack fa-lg"
                            data-count={cartCount}
                        >
                            <i className="fa fa-circle fa-stack-2x"></i>
                            <i className="fa fa-shopping-cart fa-stack-1x fa-inverse"></i>
                        </span>
                    </Link>

                    <div className="sidebar" onClick={() => setIsOpen(!isOpen)}>
                        <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-nav-overlay ${isOpen ? 'active' : ''}`}>
                <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/" onClick={() => setIsOpen(false)}>Shop</Link>
            </div>

            {/* Main Content */}
            <div className={styles['cart-container']}>
                <div className={styles['header-row']}>
                    <h1 className={styles['cart-title']}>
                        SYSTEM INVENTORY <span className={styles['blink']}>_</span>
                    </h1>
                    <span className={styles['item-count']}>[{cartItems.length} ITEMS DETECTED]</span>
                </div>

                <div className={styles['cart-grid']}>
                    {cartItems.length === 0 ? (
                        <div className={styles['empty-state']}>
                            <i className="fa fa-folder-open-o"></i>
                            <p>INVENTORY EMPTY</p>
                            <Link to="/" className={styles['return-link']}>INITIATE SHOPPING</Link>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className={styles['cart-item']}>
                                <div className={styles['img-wrapper']}>
                                    <img src={item.img} alt={item.name} />
                                </div>

                                <div className={styles['item-info']}>
                                    <div className={styles['item-name']}>{item.name}</div>
                                    <div className={styles['item-specs']}>
                                        <span>COLOR: {item.color}</span>
                                        <span>SPEC: {item.size}</span>
                                    </div>
                                </div>

                                <div className={styles['price-action-group']}>
                                    <div className={styles['item-price']}>RM {item.price}</div>
                                    <button
                                        className={styles['remove-btn']}
                                        onClick={() => removeItem(index)}
                                        title="Delete Item"
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className={styles['summary-panel']}>
                        <div className={styles['summary-row']}>
                            <span>SUBTOTAL:</span>
                            <span>RM {totalPrice.toFixed(2)}</span>
                        </div>
                        <div className={styles['summary-row']}>
                            <span>TAX (SST):</span>
                            <span>RM 0.00</span>
                        </div>
                        <div className={`${styles['summary-row']} ${styles['total-row']}`}>
                            <span>TOTAL_COST:</span>
                            <span className={styles['neon-total']}>RM {totalPrice.toFixed(2)}</span>
                        </div>

                        <div className={styles['action-buttons']}>
                            <button className={styles['checkout-btn']} onClick={handleCheckout} >
                                PROCEED TO CHECKOUT <i className="fa fa-chevron-right"></i>
                            </button>
                            <button className={styles['clear-btn']} onClick={clearCart}>
                                PURGE INVENTORY
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;