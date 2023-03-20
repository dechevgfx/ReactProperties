import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css"

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  function onLogout() {
    auth.signOut();
    navigate("/");
  }
  return (
    <>
      <section className="container-profile-edit">
        <h1 className="heading">My Profile</h1>
        <div className="div-form">
          <form>
            {/* Name Input */}

            <input
              type="text"
              id="name"
              value={name}
              disabled
              className="input"
            />

            {/* Email Input */}

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="input"
            />

            <div className="options-div">
              <p className="p-question">
                Do you want to change your name?
                <span className="txt-red">
                  Edit
                </span>
              </p>
              <p
                onClick={onLogout}
                className="blue"
              >
                Sign out
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}