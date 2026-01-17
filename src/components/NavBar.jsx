import React from "react";
import {useNavigate} from "react-router-dom";

export default function NavBar({variant = "home"}) {
    const navigate = useNavigate();

    const handleGetStarted = async () => {
        try {

            await puter.auth.signIn();

            const user = await puter.auth.getUser();
            if (user) {
                navigate("/app");
            }
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const handleLogout = async () => {
        puter.auth.signOut();
        navigate("/");
    }
    return (
        <nav className="navbar">
            <a href="/">
                <p className="text-2xl font-bold text-gradient">FlashAI</p>
            </a>
            {variant === "home" &&  (
            <button onClick={handleGetStarted} className="primary-button w-fit">
                Get Started
            </button>
            )}
            {variant === "app" && (
                <button onClick={handleLogout} className="primary-button w-fit">
                    Log Out
                </button>
            )}
        </nav>
    )


}
