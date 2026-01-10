import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/GamePage.module.css';

const GamesPage = () => {
    // --- SETTINGS & STATE ---
    const itemsPerPage = 8;

    const [allGames, setAllGames] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // --- FIX: Added missing state for Global Navbar (Mobile Toggle) ---
    const [isOpen, setIsOpen] = useState(false);

    // --- 1. INITIAL LOAD (Fetch Data & Cart Count) ---
    useEffect(() => {
        // Load Cart Count
        updateCartCount();

        // Fetch JSON (Reverted to your original fetch code)
        // Note: Ensure games.json is accessible at this URL from the browser
        fetch('http://localhost:8080/api/products?category=Games')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(games => {
                const availableGames = games.filter(game => game.stock > 0);

                setAllGames(availableGames);
                setLoading(false)
            })
            .catch(err => {
                console.error("Error loading games:", err);
                setLoading(false);
            });
    }, []);

    // --- 2. LOGIC: PAGINATION SLICING ---
    const indexOfLastGame = currentPage * itemsPerPage;
    const indexOfFirstGame = indexOfLastGame - itemsPerPage;
    const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);
    const pageCount = Math.ceil(allGames.length / itemsPerPage);

    // --- 3. LOGIC: CART FUNCTIONS ---
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('kakiCart')) || [];
        setCartCount(cart.length);
    };

    const addToCartDirect = (id, name, price, imgUrl, availableStock) => {
        const cart = JSON.parse(localStorage.getItem('kakiCart')) || [];

        // Check how many of this specific ID are already in the cart
        const currentInCart = cart.filter(item => item.id === id).length;

        if (currentInCart >= availableStock) {
            alert("Sorry, you cannot add more. We only have " + availableStock + " in stock.");
            return;
        }

        const newItem = {
            cartItemId: Date.now(),
            id: id,
            name: name,
            price: price,
            img: imgUrl
        };

        cart.push(newItem);
        localStorage.setItem('kakiCart', JSON.stringify(cart));
        updateCartCount();
        alert(`${name} added to cart!`); // Optional feedback
    };

    // --- 4. LOGIC: PAGE CHANGE ---
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top of grid
        const container = document.getElementById('games-container');
        if(container) container.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={styles.gamesPageWrapper}>
            {/* --- NAV (Global Styles) --- */}

            <nav className="nav">
                {/* 1. LEFT: LOGO */}
                <Link to="/" className="logo">
                    KAKI GAMERZ<span className="dot"></span>
                </Link>

                {/* 2. CENTER: NAV LINKS */}
                <div className="nav-links desktop-menu">

                </div>

                {/* 3. RIGHT: GROUPED ACTIONS */}
                <div className="nav-actions">
                    <Link to="/cart" style={{color: '#0071e3', fontWeight: 'bold', textDecoration: 'none'}}>
                        Cart (<span id="cart-count">{cartCount}</span>)
                    </Link>
                    <Link to="/" style={{color: '#ccc', textDecoration: 'none', marginRight: '20px'}}>Home</Link>
                </div>

                {/* SIDEBAR TRIGGER */}
                <div className="sidebar" onClick={() => setIsOpen(!isOpen)}>
                    <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
                </div>
            </nav>

            {/* --- HERO SECTION (Local Styles) --- */}
            <header className={styles.hero}>
                <div className={styles['hero-content']}>
                    <span className={styles['badge-hot']}>Top Seller</span>
                    <h1>ELDEN RING: Shadow of the Erdtree</h1>
                    <p>Dive into the expansion of the year. The Land of Shadow awaits.</p>
                    <div className={styles['hero-price']}>
                        <span className={styles.discount}>-15%</span>
                        <span className={styles['price-old']}>RM 169.00</span>
                        <span className={styles['price-new']}>RM 143.65</span>
                    </div>
                    <button
                        className={styles['btn-hero']}
                        onClick={() => addToCartDirect(8,'Elden Ring: Shadow of the Erdtree', 143.65, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')}
                    >
                        Add to Cart
                    </button>
                </div>
                <div className={styles['hero-bg']}></div>
            </header>

            {/* --- MAIN CONTAINER (Local Styles) --- */}
            <div className={styles.container} id="games-container">
                <h2 className={styles['section-title']}>Latest Games</h2>

                <div className={styles['game-grid']}>
                    {loading ? (
                        <p style={{color:'white'}}>Loading games...</p>
                    ) : (
                        currentGames.map((game, index) => {
                            // Determine Badge Class
                            let badgeClass = styles['discount-badge'];
                            if(game.badge === 'NEW') badgeClass += ` ${styles.new}`;

                            return (
                                <div className={styles['game-card']} key={index}>
                                    <div className={styles['card-image']}>
                                        <img src={game.image} alt={game.name} />
                                        <span className={badgeClass}>{game.badge}</span>
                                    </div>
                                    <div className={styles['card-info']}>
                                        <h3 className={styles['game-title']}>{game.name}</h3>
                                        <p className={styles['game-desc']}>{game.desc}</p>
                                        <div className={styles['price-row']}>
                                            {game.oldPrice && (
                                                <span className={styles['price-old']}>RM {game.oldPrice.toFixed(2)}</span>
                                            )}
                                            <span className={styles['price-new']}>RM {game.price.toFixed(2)}</span>
                                        </div>
                                        <button
                                            className={styles['btn-add']}
                                            onClick={() => addToCartDirect(game.id, game.name, game.price, game.image, game.stock)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* --- PAGINATION --- */}
                <div className={styles.pagination}>
                    {pageCount > 1 && Array.from({ length: pageCount }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            className={`${styles['page-btn']} ${currentPage === number ? styles.active : ''}`}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GamesPage;