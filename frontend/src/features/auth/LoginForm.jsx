import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from './authSlice';
import { Lock, Mail, Loader2 } from 'lucide-react';

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            alert(message);
        }

        if (isSuccess || user) {
            navigate('/dashboard');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        dispatch(login(userData));
    };

    if (isLoading) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><Loader2 className="spinner-border text-primary" /></div>;
    }

   return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: 'var(--bg-wheat)' }}>
            <div className="card border-0 shadow-lg p-5" 
                 style={{ width: '100%', maxWidth: '420px', borderRadius: '20px', backgroundColor: 'var(--white)' }}>
                
                <div className="text-center mb-4">
                    <div className="d-inline-block p-3 rounded-circle mb-3" style={{ backgroundColor: 'rgba(123, 77, 255, 0.1)' }}>
                        <Lock size={32} color="var(--primary-purple)" />
                    </div>
                    <h2 className="fw-bold" style={{ color: 'var(--text-dark)' }}>Welcome Back</h2>
                    <p className="text-muted">Please enter your details</p>
                </div>

                <form onSubmit={onSubmit} className="d-grid gap-4">
                    <div>
                        <label className="form-label small fw-bold text-uppercase">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><Mail size={18} /></span>
                            <input
                                type="email"
                                className="form-control bg-light border-0 py-2"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="form-label small fw-bold text-uppercase">Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><Lock size={18} /></span>
                            <input
                                type="password"
                                className="form-control bg-light border-0 py-2"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-custom-purple py-3 fw-bold mt-2">
                        {isLoading ? <Loader2 className="spinner-border spinner-border-sm" /> : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
