import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [qrCode, setQrCode] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // Step 1 is for registration, Step 2 is for 2FA setup

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

            await response.json(); // calling json() returns a promise, so we need to await it
            await setup2FA(form.email); // setup 2FA for the user
            setStep(2);


            // localStorage.setItem('token', data.token);
            // localStorage.setItem('username', JSON.stringify(form.username));

            // navigate('/');

        } catch (error) {
           setError(error.message); 
        }
    }

    const setup2FA = async (email) => {
       
        try {
            const response = await fetch(`${apiURL}/users/setup2FA`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})
            });

            if(!response.ok) {
                throw new Error('Failed to setup 2FA QR Code');
            }

            const data = await response.json();
            setQrCode(data.imageUrl);
            
        } catch (error) {
            setError(error.message);
        }
    }

    const verify2FASetup = async () => {
        const response = await fetch(`${apiURL}/users/verify2FA`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: form.email, token: otp})
        });

        if (!response.ok) {
            setError('Invalid OTP')
        }

        setError('2FA Setup Successful, you can now log in');
        navigate('/login');
    }

    return (
        <div className="contaier mt-4">
            <h1 className="text-center">Register</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {step === 1 && (
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
            )}
            {step === 2 && (
                <div>
                    {qrCode && <img src={qrCode} alt="QR Code"/>}
                    <div className="form-group">
                        <label htmlFor="otp">Enter OTP</label>
                        <input type="text" 
                            className="form-control" 
                            id="otp" 
                            name="otp" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            />
                    </div>
                    <button onClick={verify2FASetup} className="btn btn-primary">Verify OTP</button>
                </div>
            )}
        </div>
    )

};

export default Register;