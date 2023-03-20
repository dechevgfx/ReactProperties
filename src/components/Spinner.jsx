import spinner from "../assets/svg/Spin-1s-200px.svg";
export default function Spinner() {
  return (
    <div className="spinner-div">
      <div>
        <img src={spinner} alt="Loading..." className="img-spin" />
      </div>
    </div>
  );
}