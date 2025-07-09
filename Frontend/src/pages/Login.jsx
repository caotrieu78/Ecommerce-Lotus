import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";
import { PATHS } from "../constants/paths";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(username, password);
            window.location.reload();
        } catch (err) {
            setError(err.message || "Đăng nhập thất bại");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="container py-5 d-flex justify-content-center"
            style={{ minHeight: "80vh", alignItems: "center" }}
        >
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

                    .login-container {
                        background: linear-gradient(135deg, #fff0f5 0%, #ffebee 100%);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 2rem 0;
                    }

                    .login-card {
                        background: #ffffff;
                        border-radius: 15px;
                        padding: 2rem;
                        box-shadow: 0 6px 20px rgba(255, 105, 180, 0.1);
                        max-width: 400px;
                        width: 100%;
                        text-align: center;
                    }

                    .login-title {
                        font-family: 'Poppins', sans-serif;
                        font-size: 2rem;
                        color: #ff69b4;
                        margin-bottom: 1.5rem;
                        font-weight: 600;
                    }

                    .form-control {
                        border: 1px solid #ffccd5;
                        border-radius: 8px;
                        padding: 0.9rem;
                        font-size: 1rem;
                        width: 100%;
                        margin-bottom: 1rem;
                        background: #fff5f7;
                        transition: border-color 0.3s ease;
                    }

                    .form-control:focus {
                        border-color: #ff69b4;
                        outline: none;
                        background: #ffffff;
                    }

                    .password-wrapper {
                        position: relative;
                        margin-bottom: 1rem;
                    }

                    .toggle-password {
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #ff69b4;
                        cursor: pointer;
                        font-size: 1.2rem;
                    }

                    .btn-primary {
                        background: linear-gradient(90deg, #ff69b4, #ff8c94);
                        border: none;
                        padding: 0.9rem;
                        font-size: 1.1rem;
                        font-weight: 500;
                        border-radius: 8px;
                        color: #ffffff;
                        width: 100%;
                        transition: background 0.3s ease;
                    }

                    .btn-primary:hover {
                        background: linear-gradient(90deg, #ff4d94, #ff6b81);
                    }

                    .alert-danger {
                        border-radius: 8px;
                        font-size: 0.9rem;
                        margin-bottom: 1rem;
                        background: #ffebee;
                        border: 1px solid #ff9999;
                        color: #d32f2f;
                        padding: 0.5rem;
                    }

                    .register-link {
                        color: #ff69b4;
                        text-decoration: none;
                        font-weight: 500;
                    }

                    .register-link:hover {
                        color: #ff4d94;
                        text-decoration: underline;
                    }

                    @media (max-width: 576px) {
                        .login-card {
                            padding: 1.5rem;
                            margin: 0 1rem;
                        }
                        .login-title {
                            font-size: 1.6rem;
                        }
                        .form-control {
                            font-size: 0.95rem;
                            padding: 0.8rem;
                        }
                        .btn-primary {
                            font-size: 1rem;
                        }
                    }
                `}
            </style>
            <div className="login-card">
                <h3 className="login-title">Đăng Nhập</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tên đăng nhập"
                        required
                    />

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </span>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Đăng Nhập
                    </button>

                    <div className="mt-3">
                        <span>Chưa có tài khoản? </span>
                        <Link to={PATHS.REGISTER} className="register-link">
                            Đăng Ký
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
