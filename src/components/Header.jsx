import "../styles/Header.css";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const [pageState, setPageState] = useState("SIGN IN");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("PROFILE");
      } else {
        setPageState("SIGN IN");
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
      <div className="header-container">
        <div>
          <img
            src={process.env.PUBLIC_URL + "/logo-no-background.png"}
            className="logo"
            alt="logo"
            onClick={() => navigate("/")}
          />
        </div>
        <ul className="navbar">
          <li className={pathMatch("/")} onClick={() => navigate("/")}>
            HOME
          </li>
          <li
            className={pathMatch("/offers")}
            onClick={() => navigate("/offers")}
          >
            OFFERS
          </li>
          <li
            className={pathMatch("/signin") || pathMatch("/profile")}
            onClick={() => navigate("/profile")}
          >
            {pageState}
          </li>
        </ul>
      </div>
    </header>
  );
};
export default Header;
