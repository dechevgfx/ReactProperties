import { Outlet, Navigate } from "react-router-dom";
import { AuthStatus } from "../hooks/AuthStatus";
export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = AuthStatus();
  if (checkingStatus) {
    return <h3>Loading...</h3>;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/signin" />;

}
