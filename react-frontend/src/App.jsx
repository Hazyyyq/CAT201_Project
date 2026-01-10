import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// IMPORT YOUR PAGES
import ScrollToTop from './PinPagePosition.jsx';
import FrontPage from './pages/FrontPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProductPage from './pages/ProductPage';
import GamePage from './pages/GamePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
    return (
        <Router>
            <ScrollToTop/>
            <Routes>
                {/* URL: / -> Shows FrontPage */}
                <Route path="/" element={<FrontPage/>}/>

                {/* URL: /about -> Shows AboutPage */}
                <Route path="/about" element={<AboutPage/>}/>

                <Route path="/login" element = {<LoginPage/>}/>

                <Route path="/signup" element = {<SignUpPage/>}/>

                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

                <Route path="/admin" element = {<AdminPage/>}/>

                <Route path="/games" element = {<GamePage/>}/>

                <Route path="/products" element={<ProductPage/>}/>

                <Route path="/cart" element={<CartPage/>}/>



            </Routes>
        </Router>
    );
}

export default App;

