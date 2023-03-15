import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div>
            <header>
                <div className="nav container">
                    <div>
                        <img
                            src={
                                process.env.PUBLIC_URL +
                                "/logo-no-background.svg"
                            }
                            className="logo"
                            alt="logo"
                            onClick={() => navigate("/")}
                        />
                    </div>
                    <div>
                        <ul className="navbar">
                            <li
                                className={
                                    location.pathname === "/" ? "active" : ""
                                }
                                onClick={() => navigate("/")}
                            >
                                HOME
                            </li>
                            <li
                                className={
                                    location.pathname === "/offers"
                                        ? "active"
                                        : ""
                                }
                                onClick={() => navigate("/offers")}
                            >
                                OFFERS
                            </li>
                            <li
                                className={
                                    location.pathname === "/signin"
                                        ? "active"
                                        : ""
                                }
                                onClick={() => navigate("/signin")}
                            >
                                SIGN IN
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </div>
    );
}
