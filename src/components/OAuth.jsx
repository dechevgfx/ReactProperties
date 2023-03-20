import { FcGoogle } from "react-icons/fc";
import "../styles/OAuth.css";

export default function OAuth() {
  return (
    <button className="oauth-button">
      <FcGoogle className="google-icon" />
      Continue with Google
    </button>
  );
}