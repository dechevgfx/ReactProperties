/* This is a React component called `Contact` that allows a user to send a message to a landlord
regarding a specific listing. */
import styles from "./Contact.module.css";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase";

const Contact = ({ userRef, listing }) => {
    /* Using the `useState` hook to declare two state variables `landlord` and `message`. */
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");
    /* `useEffect` is a React hook that allows us to perform side effects in functional components. In this
    case, the `useEffect` hook is used to fetch data about the landlord from the Firebase database when
    the `userRef` prop changes. */
    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, "users", userRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                toast.error("Could not get landlord data");
            }
        };
        getLandlord();
    }, [userRef]);
    /**
     * The function sets the value of a message variable to the value of an input field when it changes.
     */
    const onChange = (e) => {
        setMessage(e.target.value);
    };
    return (
        /* The fragment is used to conditionally render
        the contact form only when the `landlord` state variable is not null. The form includes a paragraph
        with the landlord's name and the listing name, a textarea for the user to enter their message, and a
        button to send the message via email using the `mailto` protocol. The `onChange` function is called
        when the user types in the textarea and updates the `message` state variable accordingly. The
        `styles` object is used to apply CSS styles to the different elements in the form. */
        <>
            {landlord !== null && (
                <div className={styles.container}>
                    <p>
                        Contact {landlord.name} for the {listing.name}
                    </p>
                    <div className={styles.contactDiv}>
                        <textarea
                            name="message"
                            id="message"
                            rows="2"
                            value={message}
                            onChange={onChange}
                            className={styles.msgBox}
                        ></textarea>
                    </div>
                    <a
                        href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
                    >
                        <button className={styles.contactBtn} type="button">
                            Send Message
                        </button>
                    </a>
                </div>
            )}
        </>
    );
};
export default Contact;
