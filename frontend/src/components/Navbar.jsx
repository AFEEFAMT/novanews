import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

const Navbar = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <Newspaper size={28} color="white" />
                <h2>NovaNews</h2>
            </Link>
            
            <div className="navbar-links">
                <Link to="/library" className="nav-link">
                    My Library
                </Link>
                <button className="btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;