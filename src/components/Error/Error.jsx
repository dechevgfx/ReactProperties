import { FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Error.css";

const Error = () => {
    return (
        <>
            <div className="error-message">
                <FaExclamationCircle />
            </div>
            <div className="error-message">
                <p>Sorry, page not found.</p>
            </div>
            <div className="button-error">
                <Link to="/offers">
                    <button className="err-btn">CHECK OUR OFFERS</button>
                </Link>
            </div>
        </>
    );
};

export default Error;
