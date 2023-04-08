/* This React component called `PrivateRoute` that is used to protect routes that require
authentication. It imports `Outlet` and `Navigate` from the `react-router-dom` library, which are
used to render child routes and navigate to a different route, respectively. It also imports the
`useAuthStatus` hook from a custom `useAuthStatus` module that checks if the user is logged in or not. If
the `checkingStatus` flag is true, it displays a `Spinner` component to indicate that the
authentication status is being checked. If the user is logged in, it renders the child routes using
the `Outlet` component. If the user is not logged in, it navigates to the `/signin` route using the
`Navigate` component. Finally, the `PrivateRoute` component is exported as the default export of the
module. */

import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../../hooks/useAuthStatus";
import Spinner from "../Spinner/Spinner";
const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return <Spinner />;
  }
  /* If `loggedIn` is true, it returns the
  child routes using the `Outlet` component, which renders the child routes of the current route. If
  `loggedIn` is false, it navigates to the `/signin` route using the `Navigate` component, which
  redirects the user to the specified route. */
  return loggedIn ? <Outlet /> : <Navigate to="/signin" />;
};
export default PrivateRoute;
