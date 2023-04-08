/* This is a React component for a "Forgot Password" page. */
import styles from "./ForgotPassword.module.css";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth/OAuth";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const onChange = (e) => {
        setEmail(e.target.value);
    };
    /**
     * This function sends a password reset email using Firebase authentication and displays a success
     * or error message using toast notifications.
     */
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            navigate("/signin");
            toast.success("Email with instructions was sent");
        } catch (error) {
            toast.error("Could not reset password");
        }
    };
    return (
        <>
            <section>
                <h1 className={styles.heading}>Forgot Password</h1>
                <hr />
                <br />

                <div className={styles.divContainer}>
                    <div className={styles.formDiv}>
                        <form onSubmit={onSubmit}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="Email address"
                                    className={styles.input}
                                />
                            </div>

                            <div>
                                <p className={styles.pLink}>
                                    Don't have a account?
                                    <Link
                                        to="/signup"
                                        className={styles.txtRed}
                                    >
                                        Register
                                    </Link>
                                </p>
                                <p>
                                    <Link
                                        to="/signin"
                                        className={styles.txtBlue}
                                    >
                                        Sign in instead
                                    </Link>
                                </p>
                            </div>
                            <button className={styles.submit} type="submit">
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
