import { Outlet, Navigate } from "react-router-dom";
import { AuthStatus } from "../hooks/AuthStatus";
import Spinner from "./Spinner";
const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = AuthStatus();
  if (checkingStatus) {
    return <Spinner />;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/signin" />;
};
export default PrivateRoute;
