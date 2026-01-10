import React from "react";
import {Link} from "react-router-dom";

export default function NavBar({variant = "home"}) {
    return (
        <nav className="navbar">
            <a href="/">
                <p className="text-2xl font-bold text-gradient">FlashAI</p>
            </a>
            {variant === "home" &&  (
            <button onClick={() => puter.auth.signIn()} className="primary-button w-fit">
                Get Started
            </button>
            )}
            {variant === "app" && (
                <button onClick={() => puter.auth.signOut()} className="primary-button w-fit">
                    Log Out
                </button>
            )}
        </nav>
    )


}
