import "../styles/Sign.css";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        toast.success("You are logged in");
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad user credentials");
    }
  };
  return (
    <section>
      <h1 className="heading">Sign In</h1>
      <div className="div-container">
        <div className="form-div">
          <form onSubmit={onSubmit}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
              className="input"
            />
            <div className="pass">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="input"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="icon"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="icon"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="div-btn">
              <p className="p-link">
                Don't have a account?
                <Link to="/signup" className="txt-red">
                  Register
                </Link>
              </p>

              <p>
                <Link to="/forgot-password" className="txt-blue">
                  Forgot password?
                </Link>
              </p>
            </div>
            <button className="submit" type="submit">
              Sign in
            </button>
            <div className="signup">
              <p className="p-sign">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};
export default SignIn;
