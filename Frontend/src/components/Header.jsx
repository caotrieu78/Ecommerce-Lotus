import React, { useEffect, useState, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaShoppingCart,
    FaHeart,
    FaTimes,
    FaEye,
    FaUser,
    FaSignInAlt
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Container,
    Navbar,
    Nav,
    Button,
    Form,
    FormControl,
    Badge
} from "react-bootstrap";
import CartPanel from "./CartPanel";
import ConfirmModal from "./ConfirmModal";
import { PATHS } from "../constants/paths";
import { CartContext } from "../context/CartContext";

const Header = () => {
    const { cartItemCount } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [visitCount, setVisitCount] = useState(0);
    const [flyImage, setFlyImage] = useState(null);
    const cartIconRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }

        let count = localStorage.getItem("visitCount") || 0;
        count = parseInt(count) + 1;
        localStorage.setItem("visitCount", count);
        setVisitCount(count);
    }, []);

    useEffect(() => {
        const handleCartItemAdded = (event) => {
            const { imageUrl } = event.detail;
            if (!imageUrl || !cartIconRef.current) return;

            const cartRect = cartIconRef.current.getBoundingClientRect();
            const cartX = cartRect.left + cartRect.width / 2;
            const cartY = cartRect.top + cartRect.height / 2;

            setFlyImage({
                src: imageUrl,
                startX: window.innerWidth / 2,
                startY: window.innerHeight / 2,
                endX: cartX,
                endY: cartY
            });

            setTimeout(() => setFlyImage(null), 1000);
        };

        window.addEventListener("cartItemAdded", handleCartItemAdded);
        return () => {
            window.removeEventListener("cartItemAdded", handleCartItemAdded);
        };
    }, []);

    const handleLogout = () => setIsLogoutModalOpen(true);
    const confirmLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUser(null);
        setIsLogoutModalOpen(false);
        navigate("/login");
    };
    const closeLogoutModal = () => setIsLogoutModalOpen(false);
    const toggleSearchModal = () => setIsSearchModalOpen((prev) => !prev);
    const toggleCart = () => setIsCartOpen((prev) => !prev);
    const closeCart = () => setIsCartOpen(false);

    return (
        <>
            <style>{`
                .navbar {
                    padding: 15px 0;
                    background: linear-gradient(180deg, #fff0f5, #ffe4ec);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .navbar-brand img {
                    height: 48px;
                    object-fit: contain;
                }
                .nav-link-custom {
                    font-size: 1rem;
                    font-weight: 500;
                    color: #c40380 !important;
                }
                .nav-link-custom:hover {
                    color: #e64a94 !important;
                }
                .badge {
                    font-size: 0.75rem;
                }
            `}</style>

            {flyImage && (
                <img
                    src={flyImage.src}
                    className="fly-to-cart"
                    style={{
                        left: `${flyImage.startX}px`,
                        top: `${flyImage.startY}px`,
                        "--endX": `${flyImage.endX - flyImage.startX}px`,
                        "--endY": `${flyImage.endY - flyImage.startY}px`
                    }}
                    alt="Flying product"
                />
            )}

            <Navbar expand="lg" className="sticky-top">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">
                        <img src="/images/logo.png" alt="Brand Logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <Nav className="me-auto mx-auto">
                            <Nav.Link as={NavLink} to="/" className="nav-link-custom">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/shop" className="nav-link-custom">Shop</Nav.Link>
                            <Nav.Link as={NavLink} to="/shoping-cart" className="nav-link-custom">Cart</Nav.Link>
                            <Nav.Link as={NavLink} to="/blog" className="nav-link-custom">Blog</Nav.Link>
                            <Nav.Link as={NavLink} to={PATHS.ABOUT} className="nav-link-custom">About</Nav.Link>
                            <Nav.Link as={NavLink} to={PATHS.CONTACT} className="nav-link-custom">Contact</Nav.Link>
                        </Nav>
                        <div className="d-flex gap-3 align-items-center">
                            <FaSearch onClick={toggleSearchModal} style={{ cursor: 'pointer', color: '#c40380' }} />
                            <div className="position-relative" ref={cartIconRef}>
                                <FaShoppingCart onClick={toggleCart} style={{ cursor: 'pointer', color: '#c40380' }} />
                                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
                                    {cartItemCount}
                                </Badge>
                            </div>
                            <FaHeart style={{ color: '#c40380' }} />
                            {user ? (
                                <>
                                    <span className="text-nowrap"><FaUser /> {user.FullName || user.Username}</span>
                                    <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
                                </>
                            ) : (
                                <NavLink to="/login" className="text-decoration-none">
                                    <FaSignInAlt /> Login
                                </NavLink>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {isSearchModalOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }} onClick={toggleSearchModal}>
                    <div className="bg-white p-4 search-modal w-100" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-end">
                            <Button variant="light" onClick={toggleSearchModal}><FaTimes /></Button>
                        </div>
                        <Form className="d-flex mt-3">
                            <FormControl type="search" placeholder="Search..." className="me-2" />
                            <Button variant="outline-primary"><FaSearch /></Button>
                        </Form>
                    </div>
                </div>
            )}

            <ConfirmModal
                show={isLogoutModalOpen}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
                onConfirm={confirmLogout}
                onClose={closeLogoutModal}
            />

            <CartPanel isOpen={isCartOpen} onClose={closeCart} />
        </>
    );
};

export default Header;
