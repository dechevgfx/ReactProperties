import "../styles/Sign.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const onChange = (e) => {
        setEmail(e.target.value);
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success("Email with instructions was sent");
        } catch (error) {
            toast.error("Could not reset password");
        }
    };
    return (
        <>
            <section>
                <h1 className="heading">Forgot Password</h1>
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

                            <div className="div-btn">
                                <p className="p-link">
                                    Don't have a account?
                                    <Link to="/signup" className="txt-red">
                                        Register
                                    </Link>
                                </p>
                                <p>
                                    <Link to="/signin" className="txt-blue">
                                        Sign in instead
                                    </Link>
                                </p>
                            </div>
                            <button className="submit" type="submit">
                                Send reset password
                            </button>
                            <OAuth />
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};
export default ForgotPassword;
