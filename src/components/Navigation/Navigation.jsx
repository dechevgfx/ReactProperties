/* This is a React component called `Navigation` that renders a header with a logo and a navigation
bar. It uses the `useLocation` and `useNavigate` hooks from `react-router-dom` to handle navigation
between pages. It also uses the `getAuth` and `onAuthStateChanged` functions from `firebase/auth` to
check if a user is authenticated and display the appropriate navigation links. The `useState` and
`useEffect` hooks from `react` are used to manage the state of the component. The `pathMatch`
function is used to determine if the current route matches a given path and apply a CSS class to the
corresponding navigation link. The CSS styles for the component are imported from a separate CSS
module file. */
import styles from "./Navigation.module.css";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const Navigation = () => {
    const location = useLocation();
    const [pageState, setPageState] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setPageState(true);
            } else {
                setPageState(false);
            }
        });
    }, [auth]);

    const pathMatch = (route) => {
        if (route === location.pathname) {
            return true;
        }
    };

    return (
        <header>
            <div className={styles.headerContainer}>
                <div>
                    <img
                        src={process.env.PUBLIC_URL + "/logo-no-background.png"}
                        className={styles.logo}
                        alt="logo"
                        onClick={() => navigate("/")}
                    />
                </div>
                <ul className={styles.navbar}>
                    <li
                        className={pathMatch("/")}
                        onClick={() => navigate("/")}
                    >
                        HOME
                    </li>
                    <li
                        className={pathMatch("/offers")}
                        onClick={() => navigate("/offers")}
                    >
                        OFFERS
                    </li>
                    {pageState ? (
                        <>
                            <li
                                className={pathMatch("/my-likes")}
                                onClick={() => navigate("/my-likes")}
                            >
                                LIKES
                            </li>
                        </>
                    ) : (
                        ""
                    )}
                    <li
                        className={
                            pathMatch("/signin") || pathMatch("/profile")
                        }
                        onClick={() => navigate("/profile")}
                    >
                        {pageState ? "PROFILE" : "SIGN IN"}
                    </li>
                </ul>
            </div>
        </header>
    );
};
export default Navigation;
