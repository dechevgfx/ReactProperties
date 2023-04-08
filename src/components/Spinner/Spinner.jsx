/**
 * The Spinner function returns a loading spinner component with a CSS module styling.
 * @returns The `Spinner` component is being returned, which renders an animated spinner image using an
 * SVG file.
 */

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
