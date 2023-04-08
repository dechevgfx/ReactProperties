/**
 * The above function is a React component that allows users to sign in with their Google account using
 * Firebase authentication and saves their information to a Firestore database.
 * @returns This code exports a functional component named `OAuth` that returns a button with the text
 * "Continue with Google" and a Google icon. When the button is clicked, it triggers the
 * `onGoogleClick` function which uses Firebase authentication to sign in with Google and checks if the
 * user exists in the Firestore database. If the user does not exist, it creates a new document with
 * the user's name,
 */
import styles from "./OAuth.module.css";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
    const navigate = useNavigate();
    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // check for the user

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                });
            }
            navigate("/");
        } catch (error) {
            toast.error("Could not authorize with Google");
        }
    };

    return (
        <button
            className={styles.oauthButton}
            onClick={onGoogleClick}
            type="button"
        >
            <FcGoogle className={styles.googleIcon} />
            Continue with Google
        </button>
    );
};
export default OAuth;
