import React from "react";

export default function NavBar({variant = "home"}) {
    return (
        <nav className="navbar">
            <a href="/">
                <p className="text-2xl font-bold text-gradient">FlashAI</p>
            </a>
            {variant === "home" &&  (
            <a href="/auth" className="primary-button w-fit">
                Get Started
            </a>
            )}
            {variant === "app" && (
                <button className="primary-button w-fit">
                    Log Out
                </button>
            )}
        </nav>
    )


}
