import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiURL = '/api';

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]:value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission
        try {
            const response = await fetch(`${apiURL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if(!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', JSON.stringify(form.username));

            navigate('/');

        } catch (error) {
           setError(error.message); 
        }
    }

    return (
        <div className="contaier mt-4">
            <h1 className="text-center">Register</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" 
                        className="form-control" 
                        id="username" 
                        name="username" 
                        value={form.username}
                        onChange={handleChange}
                        required
                        />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        value={form.email}
                        onChange={handleChange}
                        required
                        />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        value={form.password}
                        onChange={handleChange}
                        required
                        />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )

};

export default Register;