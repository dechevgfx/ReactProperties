import spinner from "../../assets/svg/Pulse-1s-200px.svg";
import "./Spinner.css";
const Spinner = () => {
  return (
    <div className="spinner-div">
      <div>
        <img src={spinner} alt="Loading..." className="img-spin" />
      </div>
    </div>
  );
};
export default Spinner;
