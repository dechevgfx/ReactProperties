import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Header() {
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

  function pathMatch(route) {
    if (route === location.pathname) {
      return true;
    }
  }
  return (
    <div>
      <header>
        <div className="nav container">
          <div>
            <img
              src={process.env.PUBLIC_URL + "/logo-no-background.svg"}
              className="logo"
              alt="logo"
              onClick={() => navigate("/")}
            />
          </div>
          <div>
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
                className={(pathMatch("/signin") || pathMatch("/profile"))}
                onClick={() => navigate("/profile")}
              >
                {pageState}
              </li>
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}
