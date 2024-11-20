import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({setUser}) => {

    // Add 2FA to login
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // Step 1 Login, Step 2 OTP
     
    const [form, setForm] = useState({
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
            const response = await fetch(`${apiURL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if(!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            if(data.is2FAEnabled){
                // Proceed with OTP check
                setStep(2);
            } else  {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', JSON.stringify(data.username));
                setUser({username: data.username, token: data.token});
                navigate('/');
            }
            
        } catch (error) {
           setError(error.message); 
        }
    }


    const handleOTPSubmit = async (e) => {
        e.preventDefault(); 
        
        try {
            const response = await fetch(`${apiURL}/users/verifyOTP`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: form.email, token:otp})
            })

            if(!response.ok){
                throw new Error('OTP verification failed');
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', JSON.stringify(data.username));
            setUser({username: data.username, token: data.token});
            navigate('/');


        } catch (error) {
            setError(error.message);
        }
    }

    const handleOTPChange = (e) => {
        setOtp(e.target.value);
    }



    return (
        <div className="contaier mt-4">
            <h1 className="text-center">Login</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {step === 1 && (
                            <form onSubmit={handleSubmit}>
                
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
                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
            )}
            {step === 2 && (
                <form onSubmit={handleOTPSubmit}>
                    <div className="form-group">
                        <label htmlFor="otp">OTP</label>
                        <input type="text" 
                        id="otp"
                        name="otp"
                        value={otp}
                        onChange={handleOTPChange}
                        required />
                        <button type="submit" className="btn btn-primary">Submit OTP</button>
                    </div>
                </form>
            )}

        </div>
    )

};

export default Login;