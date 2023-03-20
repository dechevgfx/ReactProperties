import { Outlet, Navigate } from "react-router-dom";
import { AuthStatus } from "../hooks/AuthStatus";
import Spinner from "./Spinner";
export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = AuthStatus();
  if (checkingStatus) {
    return <Spinner/>;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/signin" />;

}
