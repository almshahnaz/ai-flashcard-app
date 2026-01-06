import React from "react";

export default function NavBar({showCTA = true}) {
    return (
        <nav className="navbar">
            <a href="/">
                <p className="text-2xl font-bold text-gradient">FlashAI</p>
            </a>
            {showCTA ?  (
            <a href="/auth" className="primary-button w-fit">
                Get Started
            </a>
            ) : (
                <a href="/auth" className="primary-button w-fit">
                    Log Out
                </a>
            )}
        </nav>
    )


}
