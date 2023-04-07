import styles from "./SignUp.module.css";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../../components/OAuth/OAuth";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { db } from "../../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const { name, email, password } = formData;
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
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            updateProfile(auth.currentUser, {
                displayName: name,
            });
            const user = userCredential.user;
            const formDataCopy = { ...formData };
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();

            await setDoc(doc(db, "users", user.uid), formDataCopy);
            toast.success("Sign up successful");
            navigate("/");
        } catch (error) {
            toast.error("Something went wrong with the registration");
        }
    };
    return (
        <>
            <section>
                <h1 className={styles.heading}>SIGN UP</h1>
                <hr />
                <br />
                <div className={styles.divContainer}>
                    <div className={styles.formDiv}>
                        <form onSubmit={onSubmit}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={onChange}
                                    placeholder="Full name"
                                    className={styles.input}
                                />
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
                                    Have a account?
                                    <Link
                                        to="/signin"
                                        className={styles.txtRed}
                                    >
                                        Sign in
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
                                Sign up
                            </button>
                            <OAuth />
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};
export default SignUp;
