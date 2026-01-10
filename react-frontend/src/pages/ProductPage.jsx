import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../style/ProductPage.module.css';

const ProductPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type') || 'phone';

    // --- 1. FIX: Initialize as null, not a string ---
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    const [color, setColor] = useState('');
    const [size, setSize] = useState('128');
    const [finalPrice, setFinalPrice] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // --- 2. FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/products');
                const data = await response.json();

                const foundProduct = data.find(item =>
                    item.category && item.category.toLowerCase() === type.toLowerCase()
                );

                if (foundProduct) {
                    setProduct(foundProduct);
                    setFinalPrice(foundProduct.price);

                    if (foundProduct.colors && foundProduct.colors.length > 0) {
                        setColor(foundProduct.colors[0].name);
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [type]);

    // Mouse Tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('kakiCart')) || [];
        setCartCount(cart.length);
    }, []);

    useEffect(() => {
        if (product && typeof product === 'object') { // FIX: Ensure product is the object
            let extraCost = 0;
            if (size === "256") extraCost = 500;
            if (size === "512") extraCost = 1000;
            setFinalPrice(product.price + extraCost);
        }
    }, [size, product]);

    const addToCart = () => {
        if (!product || typeof product !== 'object') return;

        const cart = JSON.parse(localStorage.getItem('kakiCart')) || [];

        const currentInCart = cart.filter(item => item.id === product.id).length;

        if (currentInCart >= product.stock) {
            alert(`Sorry, you cannot add more. We only have ${product.stock} units of ${product.name} in stock.`);
            return; // STOP execution here
        }
        const newItem = {
            cartId: Date.now(), // Unique for the cart list
            id: product.id,     // THE REAL ID from products.json (e.g., 25)
            name: product.name,
            price: finalPrice,
            img: product.image || product.img,
            color: color,
            size: size + "GB"
        };
        cart.push(newItem);
        localStorage.setItem('kakiCart', JSON.stringify(cart));
        setCartCount(cart.length);
        alert(`Added ${product.name} to your bag.`);
    };

    if (loading) return <div style={{height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;
    // --- 3. FIX: Check if product is still the initial string or null ---
    if (!product || typeof product !== 'object') return <div style={{height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Product Not Found</div>;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.noiseOverlay}></div>
            <div className={styles.interactiveSpotlight}></div>
            <div className={styles.bgGrid}></div>

            <nav className="nav">
                <Link to="/" className="logo">
                    KAKI GAMERZ<span className="dot"></span>
                </Link>
                <div className="nav-actions">
                    <div className="nav-links desktop-menu">
                        <Link to="/">Home</Link>
                    </div>
                    <Link to="/cart" className="cart-icon-container">
                        <span className="fa-stack fa-lg" data-count={cartCount}>
                            <i className="fa fa-circle fa-stack-2x"></i>
                            <i className="fa fa-shopping-cart fa-stack-1x fa-inverse"></i>
                        </span>
                    </Link>
                    <div className="sidebar" onClick={() => setIsOpen(!isOpen)}>
                        <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
                    </div>
                </div>
            </nav>

            <div className={styles.container}>
                <div className={styles.imageSection}>
                    {product.badge && (
                        <span className={`${styles.productBadge} ${(!product.badge.includes('%')) ? styles.statusBadge : ''}`}>
                {product.badge}
            </span>
                    )}
                    <img src={product.image || product.img} alt={product.name} className={styles.img} />
                </div>

                <div className={styles.detailsSection}>
                    <span className={`${styles.brandTag} ${styles.stagger1}`}>KAKI GAMERZ OFFICIAL</span>
                    <h1 className={`${styles.productTitle} ${styles.stagger2}`}>{product.name}</h1>
                    {product.oldPrice && (
                        <span className={styles.oldPriceText}>RM {product.oldPrice}</span>
                    )}
                    <div className={`${styles.priceTag} ${styles.stagger3}`}>RM {finalPrice}</div>

                    {/* --- SPECS GRID --- */}
                    <div className={`${styles.specGrid} ${styles.stagger4}`}>
                        {Array.isArray(product.specs) && product.specs.map((spec, index) => (
                            <div key={index} className={styles.specItem}>
                                <i className={`fa ${spec.icon}`}></i>
                                <span>{spec.label}</span>
                            </div>
                        ))}
                    </div>

                    <p className={`${styles.productDesc} ${styles.stagger5}`}>{product.desc}</p>
                    <div className={`${styles.divider} ${styles.stagger5}`}></div>

                    {/* --- COLOR SWATCHES --- */}
                    {Array.isArray(product.colors) && (
                        <div className={`${styles.formGroup} ${styles.stagger6}`}>
                            <label className={styles.label}>
                                FINISH: <span className={styles.selectedVal}>{color}</span>
                            </label>
                            <div className={styles.colorGrid}>
                                {product.colors.map((c) => (
                                    <button
                                        key={c.name}
                                        className={`${styles.colorSwatch} ${color === c.name ? styles.activeSwatch : ''}`}
                                        style={{ backgroundColor: c.hex }}
                                        onClick={() => setColor(c.name)}
                                        title={c.name}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={`${styles.formGroup} ${styles.stagger6}`}>
                        <label className={styles.label}>
                            STORAGE: <span className={styles.selectedVal}>{size}GB</span>
                        </label>
                        <div className={styles.storageGrid}>
                            {['128', '256', '512'].map((s) => (
                                <button
                                    key={s}
                                    className={`${styles.storageOption} ${size === s ? styles.activeStorage : ''}`}
                                    onClick={() => setSize(s)}
                                >
                                    {s} GB
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className={`${styles.addBtn} ${styles.stagger7}`} onClick={addToCart}>
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;