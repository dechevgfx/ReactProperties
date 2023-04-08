/* This is a React component for a sign-in form. */
import styles from "./SignIn.module.css";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth/OAuth";
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
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            if (userCredential.user) {
                toast.success("You are logged in");
                navigate("/");
            }
        } catch (error) {
            toast.error("Email or password incorrect!");
        }
    };
    return (
        <>
            <section>
                <h1 className={styles.heading}>SIGN IN</h1>
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
                                <div className={styles.pass}>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        value={password}
                                        onChange={onChange}
                                        placeholder="Password"
                                        className={styles.input}
                                    />
                                    {showPassword ? (
                                        <AiFillEyeInvisible
                                            className={styles.icon}
                                            onClick={() =>
                                                setShowPassword(
                                                    (prevState) => !prevState,
                                                )
                                            }
                                        />
                                    ) : (
                                        <AiFillEye
                                            className={styles.icon}
                                            onClick={() =>
                                                setShowPassword(
                                                    (prevState) => !prevState,
                                                )
                                            }
                                        />
                                    )}
                                </div>
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
                                        to="/forgot-password"
                                        className={styles.txtBlue}
                                    >
                                        Forgot password?
                                    </Link>
                                </p>
                            </div>
                            <button className={styles.submit} type="submit">
                                Sign in
                            </button>
                            <div className={styles.signup}>
                                <OAuth />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};
export default SignIn;
