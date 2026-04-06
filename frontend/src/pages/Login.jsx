import { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        setLoading(true);
        
        try {
            const res = await axios.post(`https://novanews-jbjh.onrender.com${endpoint}`, { email, password });
            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                window.location.href = '/';
            } else {
                alert('Registration successful! Please log in.');
                setIsLogin(true);
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>{isLogin ? 'Login to NovaNews' : 'Register Account'}</h2>
                <input 
                    type="email" 
                    placeholder="Email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
                <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </p>
            </form>
        </div>
    );
};

export default Login;