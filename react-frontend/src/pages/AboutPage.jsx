import {useState} from 'react';
import {Link} from 'react-router-dom';
import styles from '../style/AboutPage.module.css';
import Footer from '../components/Footer.jsx';

function AboutPage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        // WRAP EVERYTHING IN THE NEW PAGE WRAPPER TO GET FULL BACKGROUND
        <div className={styles.pageWrapper}>

            <nav className="nav">
                <Link to="/" className="logo">
                    KAKI GAMERZ<span className="dot"></span>
                </Link>

                <div className="nav-links desktop-menu">
                    <Link to="/">Home</Link>
                </div>

                <div className="sidebar" onClick={() => setIsOpen(!isOpen)}>
                    <i className={`fa ${isOpen ? "fa-times" : "fa-bars"}`}></i>
                </div>
            </nav>

            <div className={`mobile-nav-overlay ${isOpen ? 'active' : ''}`}>
                <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            </div>

            {/* MAIN CONTENT STAYS CENTERED */}
            <main className={styles.container}>
                <div className={styles['brand-header']}>
                    <h1 className={styles['big-brand-title']}>
                        KAKI <span className={styles['neon-text-title']}>GAMERZ</span>
                    </h1>
                    <hr className={styles.separator2}/>
                    <div className={styles['brand-tagline']}>YOUR REALITY, LEVELED UP.</div>

                    <p className={styles['about-text']}>
                        At <strong className={styles['text-white']}>Kaki Gamerz</strong>, we define the intersection of gaming
                        culture and modern mobility.
                        We are your premier destination for the latest <span className={styles.highlight}>video games</span>,
                        high-performance <span className={styles.highlight}>smartphones</span>, versatile tablets, and
                        essential smart wearables.
                        We move beyond traditional gaming boundaries to provide a curated ecosystem of genuine tech,
                        ensuring every enthusiast is equipped with the best tools to <strong className={styles['text-white']}>play,
                        connect, and thrive</strong>.
                    </p>
                </div>

                {/* --- TEAM GRID --- */}
                <div className={styles['All-Grid']}>

                    {/* PROFILE 1 */}
                    <article className={styles.managerProfile}>
                        <img src="/img/Airil.jpeg" alt="Airil Aiman bin Azman"/>
                        <div className={styles.info}>
                            <h5>Airil Aiman bin Azman</h5>
                            <p style={{color: '#66fcf1', fontWeight: 'bold'}}>System Architect</p>
                            <p className={styles['job-desc']}>
                                Constructed the world logic. Ensures the database is robust enough to handle the
                                ultimate boss fight.
                            </p>
                        </div>
                        <ul className={styles.ManagerSocMed}>
                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                            <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                            <li><a href="#"><i className="fa fa-linkedin-square"></i></a></li>
                        </ul>
                    </article>

                    {/* PROFILE 2 */}
                    <article className={styles.managerProfile}>
                        <img src="/img/Aiman.jpeg" alt="Mohammad Aiman Akmal bin Azlan"/>
                        <div className={styles.info}>
                            <h5>Mohammad Aiman Akmal bin Azlan</h5>
                            <p style={{color: '#66fcf1', fontWeight: 'bold'}}>UI Designer</p>
                            <p className={styles['job-desc']}>
                                Polished the pixels. Designed an interface that looks pleasing to the eye and fits the
                                game's lore.
                            </p>
                        </div>
                        <ul className={styles.ManagerSocMed}>
                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                            <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                            <li><a href="#"><i className="fa fa-linkedin-square"></i></a></li>
                        </ul>
                    </article>

                    {/* PROFILE 3 */}
                    <article className={styles.managerProfile}>
                        <img src="/img/Johan.png" alt="Muhammad Johan bin Talib"/>
                        <div className={styles.info}>
                            <h5>Muhammad Johan bin Talib</h5>
                            <p style={{color: '#66fcf1', fontWeight: 'bold'}}>UX Designer</p>
                            <p className={styles['job-desc']}>
                                Balancer of gameplay. Removed friction points to ensure the user experience is
                                overpowered.
                            </p>
                        </div>
                        <ul className={styles.ManagerSocMed}>
                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                            <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                            <li><a href="#"><i className="fa fa-linkedin-square"></i></a></li>
                        </ul>
                    </article>

                    {/* PROFILE 4 */}
                    <article className={styles.managerProfile}>
                        <img src="/img/Haziq.png" alt="Muhammad Haziq Irsyad bin Mohd Rafeein"/>
                        <div className={styles.info}>
                            <h5>Muhammad Haziq Irsyad bin Mohd Rafeein</h5>
                            <p style ={{color: '#66fcf1', fontWeight: 'bold'}} >Front-End Developer</p>
                            <p className={styles['job-desc']}>
                                Master of execution. Squashed bugs and wrote the code that makes the buttons click and
                                the animations flow.
                            </p>
                        </div>
                        <ul className={styles.ManagerSocMed}>
                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                            <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                            <li><a href="#"><i className="fa fa-linkedin-square"></i></a></li>
                        </ul>
                    </article>

                </div>

                <hr className={styles.separator}/>

                {/* --- MISSION --- */}
                <section className={styles['video-section']}>
                    <video autoPlay muted loop playsInline className={styles['back-video']}>
                        <source src="/vid/GravitiGamerz.mp4" type="video/mp4"/>
                    </video>
                    <div className={styles['video-overlay']}></div>
                    <div className={styles['MissionVision-container']}>
                        <h2 className={styles['section-title']}>Our <span className={styles.highlight}>Mission</span></h2>
                        <p>To create the ultimate home ground for the Real Kaki Gamerz.</p>
                    </div>
                </section>

                <hr className={styles.separator}/>

                {/* --- VISION --- */}
                <section className={styles['video-section']}>
                    <video autoPlay muted loop playsInline className={styles['back-video']}>
                        <source src="/vid/GravitiGamerz_2.mp4" type="video/mp4"/>
                    </video>
                    <div className={styles['video-overlay']}></div>
                    <div className={styles['MissionVision-container']}>
                        <h2 className={styles['section-title']}>Our <span className={styles.highlight}>Vision</span></h2>
                        <p>A borderless Gaming Empire where the Real Kaki Gamerz spirit thrives.</p>
                    </div>
                </section>
            </main>

            <Footer/>
        </div>
    )
}

export default AboutPage;