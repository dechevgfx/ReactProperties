import spinner from "../../assets/svg/Pulse-1s-200px.svg";
import styles from "./Spinner.module.css";
const Spinner = () => {
    return (
        <div className={styles.spinnerDiv}>
            <div>
                <img
                    src={spinner}
                    alt="Loading..."
                    className={styles.imgSpin}
                />
            </div>
        </div>
    );
};
export default Spinner;
