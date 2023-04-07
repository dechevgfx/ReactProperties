import styles from "./Contact.module.css";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase";

const Contact = ({ userRef, listing }) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");
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
    const onChange = (e) => {
        setMessage(e.target.value);
    };
    return (
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
