import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
    const [form, setForm] = useState({
        Username: "",
        Password: "",
        ConfirmPassword: "",
        Email: "",
        FullName: ""
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.Password !== form.ConfirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            await register(form);
            alert("Đăng ký thành công, vui lòng đăng nhập");
            navigate("/login");
        } catch (err) {
            setError(err.message || "Đăng ký thất bại");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div
            className="container py-5 d-flex justify-content-center"
            style={{ minHeight: "80vh", alignItems: "center" }}
        >
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

                    .register-container {
                        background: linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 1rem 0;
                    }

                    .register-card {
                        background: #ffffff;
                        border-radius: 12px;
                        padding: 2rem;
                        box-shadow: 0 4px 15px rgba(255, 105, 180, 0.15);
                        max-width: 380px;
                        width: 90%;
                        text-align: center;
                        border: 1px solid #ffccd5;
                    }

                    .register-title {
                        font-family: 'Poppins', sans-serif;
                        font-size: 1.8rem;
                        color: #ff69b4;
                        margin-bottom: 1.2rem;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    }

                    .form-control {
                        border: 1px solid #ffdddfe;
                        border-radius: 6px;
                        padding: 0.85rem;
                        font-size: 0.95rem;
                        width: 100%;
                        margin-bottom: 0.9rem;
                        background: #fff5f7;
                        transition: all 0.3s ease;
                        font-family: 'Poppins', sans-serif;
                        box-sizing: border-box;
                    }

                    .form-control:focus {
                        border-color: #ff69b4;
                        box-shadow: 0 0 6px rgba(255, 105, 180, 0.2);
                        background: #ffffff;
                        outline: none;
                    }

                    .password-wrapper {
                        position: relative;
                        margin-bottom: 0.9rem;
                    }

                    .toggle-password {
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #ff69b4;
                        cursor: pointer;
                        font-size: 1.1rem;
                        transition: color 0.3s ease;
                    }

                    .toggle-password:hover {
                        color: #ff4d94;
                    }

                    .btn-primary {
                        background: linear-gradient(90deg, #ff69b4, #ff8c94);
                        border: none;
                        padding: 0.85rem;
                        font-size: 1rem;
                        font-weight: 500;
                        border-radius: 6px;
                        color: #ffffff;
                        width: 100%;
                        box-shadow: 0 2px 10px rgba(255, 105, 180, 0.3);
                        transition: all 0.3s ease;
                    }

                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(255, 105, 180, 0.4);
                        background: linear-gradient(90deg, #ff4d94, #ff6b81);
                    }

                    .btn-primary:active {
                        transform: translateY(0);
                        box-shadow: 0 1px 5px rgba(255, 105, 180, 0.2);
                    }

                    .alert-danger {
                        border-radius: 6px;
                        font-size: 0.85rem;
                        margin-bottom: 0.8rem;
                        background: #ffebee;
                        border: 1px solid #ff9999;
                        color: #d32f2f;
                        padding: 0.4rem;
                        font-family: 'Poppins', sans-serif;
                    }

                    .login-link {
                        color: #ff69b4;
                        text-decoration: none;
                        font-weight: 500;
                        font-family: 'Poppins', sans-serif;
                    }

                    .login-link:hover {
                        color: #ff4d94;
                        text-decoration: underline;
                    }

                    @media (max-width: 768px) {
                        .register-card {
                            padding: 1.5rem;
                            margin: 0 0.5rem;
                        }
                        .register-title {
                            font-size: 1.6rem;
                        }
                        .form-control {
                            font-size: 0.9rem;
                            padding: 0.75rem;
                        }
                        .toggle-password {
                            font-size: 1rem;
                            right: 8px;
                        }
                        .btn-primary {
                            font-size: 0.95rem;
                            padding: 0.75rem;
                        }
                    }

                    @media (max-width: 480px) {
                        .register-title {
                            font-size: 1.4rem;
                        }
                        .form-control {
                            font-size: 0.85rem;
                            padding: 0.7rem;
                        }
                        .btn-primary {
                            font-size: 0.9rem;
                        }
                        .toggle-password {
                            font-size: 0.9rem;
                            right: 7px;
                        }
                    }

                    @media (max-width: 320px) {
                        .register-card {
                            padding: 1rem;
                        }
                        .register-title {
                            font-size: 1.2rem;
                        }
                        .form-control {
                            font-size: 0.8rem;
                            padding: 0.6rem;
                        }
                        .btn-primary {
                            font-size: 0.85rem;
                            padding: 0.7rem;
                        }
                    }
                `}
            </style>
            <div className="register-card">
                <h3 className="register-title">Đăng Ký</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="Username"
                        className="form-control"
                        value={form.Username}
                        onChange={handleChange}
                        placeholder="Tên đăng nhập"
                        required
                    />

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="Password"
                            className="form-control"
                            value={form.Password}
                            onChange={handleChange}
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

                    <div className="password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="ConfirmPassword"
                            className="form-control"
                            value={form.ConfirmPassword}
                            onChange={handleChange}
                            placeholder="Xác nhận mật khẩu"
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                        </span>
                    </div>

                    <input
                        type="email"
                        name="Email"
                        className="form-control"
                        value={form.Email}
                        onChange={handleChange}
                        placeholder="Email (tùy chọn)"
                    />

                    <input
                        type="text"
                        name="FullName"
                        className="form-control"
                        value={form.FullName}
                        onChange={handleChange}
                        placeholder="Họ và tên (tùy chọn)"
                    />

                    <button type="submit" className="btn btn-primary">
                        Đăng Ký
                    </button>

                    <div className="mt-3">
                        <span>Đã có tài khoản? </span>
                        <Link to="/login" className="login-link">
                            Đăng Nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
