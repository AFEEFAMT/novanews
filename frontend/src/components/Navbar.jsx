import { useNavigate, Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <nav className="navbar">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
                <Newspaper size={28} color="white" />
                <h2>NovaNews</h2>
            </Link>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/library" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
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