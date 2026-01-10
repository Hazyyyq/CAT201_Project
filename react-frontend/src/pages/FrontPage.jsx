import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import styles from '../style/FrontPage.module.css';
import Footer from "../components/Footer.jsx";

function FrontPage() {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // --- NEW: STATE FOR DYNAMIC PRODUCTS ---
    const [newArrivals, setNewArrivals] = useState([]);

    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('kakiCart')) || [];
        setCartCount(storedCart.length);
    }, []);

    // --- NEW: FETCH PRODUCTS FROM DATABASE ---
    useEffect(() => {
        fetch('http://localhost:8080/api/products')
            .then(res => res.json())
            .then(data => {
                // 1. Filter out Games (they have their own section)
                // 2. Reverse to get the newest items first
                // 3. Take the top 3 items
                const latest = data
                    .filter(p => p.category !== 'Games')
                    .reverse()
                    .slice(0, 3);
                setNewArrivals(latest);
            })
            .catch(err => console.error("Error loading new arrivals:", err));
    }, []);

    // Scroll Reveal Logic
    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }

        const reveal = () => {
            let reveals = document.getElementsByClassName(styles['info-card']);
            // Also reveal our new dynamic cards
            let dynamicCards = document.getElementsByClassName('dynamic-reveal');

            const checkReveal = (elements) => {
                for (let i = 0; i < elements.length; i++) {
                    let windowheight = window.innerHeight;
                    let revealtop = elements[i].getBoundingClientRect().top;
                    let revealpoint = 150;

                    if (revealtop < windowheight - revealpoint) {
                        elements[i].classList.add(styles.active);
                    }
                }
            };

            checkReveal(reveals);
            checkReveal(dynamicCards);
        };

        window.addEventListener('scroll', reveal);
        reveal();

        return () => window.removeEventListener('scroll', reveal);
    }, [location, newArrivals]); // Added newArrivals dependency so scroll logic updates when data loads

    const scrollToSection = (e, id) => {
        e.preventDefault();
        setIsOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', `/#${id}`);
        }
    };

    return (<>
        <nav className="nav">
            <Link to="/" className="logo">
                KAKI GAMERZ<span className="dot"></span>
            </Link>

            <div className="nav-links desktop-menu">
                <Link to="/#phone" onClick={(e) => scrollToSection(e, 'phone')}>KakiPhone</Link>
                <Link to="/#watch" onClick={(e) => scrollToSection(e, 'watch')}>KakiWatch</Link>
                <Link to="/#tablet" onClick={(e) => scrollToSection(e, 'tablet')}>KakiPad</Link>
                <Link to="/#games" onClick={(e) => scrollToSection(e, 'games')}>Games</Link>
                <Link to="/#about" onClick={(e) => scrollToSection(e, 'about')}>About Us</Link>
            </div>

            <div className="nav-actions">
                <Link to="/cart" className="cart-icon-container">
                    <span
                        id="cart-badge"
                        className="fa-stack fa-lg has-badge"
                        data-count={cartCount}
                    >
                      <i className="fa fa-circle fa-stack-2x"></i>
                      <i className="fa fa-shopping-cart fa-stack-1x fa-inverse"></i>
                    </span>
                </Link>

                <div className="nav-button">
                    {user && user.role === 'admin' && (
                        <Link to="/admin" className="nav-pill-btn">
                            Admin Panel
                        </Link>
                    )}
                    {user ? (
                        <button
                            className="nav-pill-btn"
                            onClick={() => {
                                localStorage.removeItem('currentUser');
                                window.location.reload();
                            }}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="nav-pill-btn">Login</Link>
                    )}
                </div>
            </div>

            <div className="sidebar" onClick={() => setIsOpen(!isOpen)}>
                <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
            </div>
        </nav>

        <div className={`mobile-nav-overlay ${isOpen ? 'active' : ''}`}>
            <Link to="/#phone" onClick={(e) => scrollToSection(e, 'phone')}>KakiPhone</Link>
            <Link to="/#watch" onClick={(e) => scrollToSection(e, 'watch')}>KakiWatch</Link>
            <Link to="/#tablet" onClick={(e) => scrollToSection(e, 'tablet')}>KakiPad</Link>
            <Link to="/#games" onClick={(e) => scrollToSection(e, 'games')}>Games</Link>
            <Link to="/#about" onClick={(e) => scrollToSection(e, 'about')}>About Us</Link>
        </div>

        {/* --- STATIC HERO SECTIONS --- */}
        <section id="home" className={`${styles['hero-section']} ${styles['dark-theme']} ${styles['short-hero']}`}>
            <img
                src="https://i.pinimg.com/originals/cd/f4/95/cdf4951a69fe542e2b7d6a07aa234a1b.gif"
                className={styles['hero-bg-img']}
                alt="Home Background"
            />
            <h1 className={styles['hero-store-title']}>
                KAKI <span className={styles['neon-text-title-front']}>GAMERZ</span>
            </h1>
        </section>

        <section id="phone" className={`${styles['hero-section']} ${styles['dark-theme']}`}>
            <img
                src="https://cdn.mos.cms.futurecdn.net/hUQHCvvKAHtNGxtLiB8rjP.gif"
                className={styles['hero-bg-img']}
                alt="Phone Intro"
            />
        </section>

        <section className={`${styles['hero-section']} ${styles['dark-theme']}`}>
            <img
                src="https://miro.medium.com/v2/1*aTmCQXNJDgO7oQ371gRVvg.gif"
                className={styles['hero-bg-img']}
                alt="Phone Detail"
            />
            <div className={`${styles['info-card']} reveal`}>
                <span className={styles['card-label']}>Unfair Advantage. 144Hz. Zero Lag</span>
                <h2 className={styles['card-title']}>KakiPhone<span className="dot"></span></h2>
                <Link to="/products?type=phone" className={styles['btn-shop']}>View</Link>
            </div>
        </section>

        <section id="watch" className={`${styles['hero-section']} ${styles['dark-theme']}`}>
            <img
                src="https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/3486306/APPLEWATCH_INTRO.0.gif"
                className={styles['hero-bg-img']}
                alt="Watch Intro"
            />
        </section>

        <section className={`${styles['hero-section']} ${styles['dark-theme']}`}>
            <img
                src="https://i.pinimg.com/originals/66/97/1d/66971d5b5aeaf2a98116ccb97e0ca10d.gif"
                className={styles['hero-bg-img']}
                alt="Watch Detail"
            />
            <div className={`${styles['info-card']} reveal`}>
                <span className={styles['card-label']}>Your HUD in real life.</span>
                <h2 className={styles['card-title']}>KakiWatch Ultra<span className="dot"></span></h2>
                <Link to="/products?type=watch" className={styles['btn-shop']}>View</Link>
            </div>
        </section>

        <section id="tablet" className={`${styles['hero-section']} ${styles['dark-theme']}`}>
            <img
                src="https://www.young-minds.sg/sites/default/files/inline-images/iPadAirgif.gif"
                className={styles['hero-bg-img']}
                alt="Tablet Intro"
            />
        </section>

        <section className={`${styles['hero-section']} ${styles['dark-theme']}`}>
            <img
                src="https://www.lowyat.net/wp-content/uploads/2024/05/Apple-iPad-Pro-M4-launch-8.jpg"
                className={styles['hero-bg-img']}
                alt="Tablet Detail"
            />
            <div className={`${styles['info-card']} reveal`}>
                <span className={styles['card-label']}>Bigger Screen. Better Headshots.</span>
                <h2 className={styles['card-title']}>KakiPad Air<span className="dot"></span></h2>
                <Link to="/products?type=tablet" className={styles['btn-shop']}>View</Link>
            </div>
        </section>

        {/* --- NEW DYNAMIC "FRESH DROPS" SECTION --- */}
        {/* Only renders if there are actually new products added */}
        {newArrivals.length > 0 && (
            <section
                className={`${styles['hero-section']} ${styles['dark-theme']}`}
                style={{
                    flexDirection: 'column',
                    padding: '80px 20px',
                    minHeight: 'auto', // Allow it to fit content
                    background: 'radial-gradient(circle, #1a1a1a 0%, #000000 100%)' // Subtle dark bg
                }}
            >
                {/* Section Title */}
                <div style={{
                    zIndex: 10,
                    marginBottom: '40px',
                    textAlign: 'center',
                    borderBottom: '2px solid #66fcf1',
                    paddingBottom: '10px'
                }}>
                    <h2 style={{
                        color: '#fff',
                        fontSize: '2.5rem',
                        fontFamily: 'DotGothic16, sans-serif',
                        margin: 0,
                        textTransform: 'uppercase'
                    }}>
                        Fresh <span style={{ color: '#66fcf1', textShadow: '0 0 10px rgba(102, 252, 241, 0.5)' }}>Drops</span>
                    </h2>
                </div>

                {/* Cards Grid */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '30px',
                    justifyContent: 'center',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '1200px'
                }}>
                    {newArrivals.map((product) => (
                        <div
                            key={product.id}
                            className={`${styles['info-card']} dynamic-reveal`} // Uses your existing card style + reveal animation
                            style={{
                                flex: '1 1 300px', // Responsive width
                                maxWidth: '350px',
                                padding: '30px',
                                minHeight: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                background: 'rgba(20, 20, 20, 0.8)' // Slightly darker for contrast
                            }}
                        >
                            <div>
                                <span className={styles['card-label']} style={{color:'#66fcf1'}}>NEW ARRIVAL</span>
                                <h3 className={styles['card-title']} style={{fontSize: '1.8rem', marginBottom:'10px'}}>{product.name}</h3>
                                <div style={{width: '100%', height: '180px', overflow:'hidden', borderRadius:'10px', marginBottom:'20px'}}>
                                    <img
                                        src={product.image || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                    />
                                </div>
                                <p style={{color: '#ccc', fontSize: '0.9rem', marginBottom: '20px'}}>
                                    {product.desc ? product.desc.substring(0, 60) + '...' : 'Latest tech gear from Kaki Gamerz.'}
                                </p>
                            </div>

                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                <span style={{color: '#fff', fontSize: '1.2rem', fontWeight:'bold'}}>RM {product.price}</span>
                                <Link
                                    to={`/products?type=${product.category ? product.category.toLowerCase() : 'phone'}`}
                                    className={styles['btn-shop']}
                                    style={{padding: '10px 20px', fontSize:'0.9rem'}}
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* --- GAMES SECTION (Existing) --- */}
        <section id="games" className={`${styles['hero-section']} ${styles['dark-theme']}`}>
            <img
                src="https://i.pinimg.com/originals/f0/06/1d/f0061dcf4eb30dded5caeb4bb1730363.gif"
                className={styles['hero-bg-img']}
                alt="Games Background"
            />
            <div className={`${styles['info-card']} reveal`}>
                <span className={styles['card-label']}>Got the Gear? Now Get the Game.</span>
                <h2 className={styles['card-title']}>Our Latest Games <span className="dot"></span></h2>
                <Link to="/games" className={styles['btn-shop']}>View</Link>
            </div>
        </section>

        <section id="about" className={`${styles['hero-section']} ${styles['dark-theme']} ${styles['short-hero']}`}>
            <img
                src="https://i.pinimg.com/originals/cd/f4/95/cdf4951a69fe542e2b7d6a07aa234a1b.gif"
                className={styles['hero-bg-img']}
                alt="About Team Background"
            />
            <div className={`${styles['info-card']} reveal`}>
                <span className={styles['card-label']}>Meet the Kaki Gamerz Team.</span>
                <h2 className={styles['card-title']}>Kaki Gamerz Corp.<span className="dot"></span></h2>
                <Link to="/about" className={styles['btn-shop']}>Meet the Squad</Link>
            </div>
        </section>

        <Footer/>
    </>)
}

export default FrontPage;