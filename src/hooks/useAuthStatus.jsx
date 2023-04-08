/**
 * This custom react hook checks the authentication status of a user and returns whether they are logged in or
 * not, along with a checking status.
 * @returns The `useAuthStatus` component returns an object with two properties: `loggedIn` and
 * `checkingStatus`. These properties are updated based on the user's authentication status using
 * Firebase's `onAuthStateChanged` method. `loggedIn` is a boolean value that indicates whether the
 * user is currently logged in or not, while `checkingStatus` is a boolean value that indicates whether
 * the component is still checking the user
 */
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        console.log(auth);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
            }
            setCheckingStatus(false);
        });
    }, []);
    return { loggedIn, checkingStatus };
};
