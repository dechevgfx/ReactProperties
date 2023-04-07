import { FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./Error.module.css";

const Error = () => {
    return (
        <>
            <div className={styles.errorMessage}>
                <FaExclamationCircle />
            </div>
            <div className={styles.errorMessage}>
                <p>Sorry, page not found.</p>
            </div>
            <div className={styles.buttonError}>
                <Link to="/offers">
                    <button className={styles.errBtn}>CHECK OUR OFFERS</button>
                </Link>
            </div>
        </>
    );
};

export default Error;
