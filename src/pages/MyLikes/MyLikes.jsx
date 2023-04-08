/* `MyLikes` component displays a list of properties that the user has
liked. It imports various modules from React, Firebase, and other components. It uses the `useState`
hook to manage the state of the `listings` and `loading` variables. It also uses the `useEffect`
hook to fetch the liked listings from Firebase and update the state accordingly. The component
renders a spinner while the data is being fetched, and then displays the list of liked properties
using the `Offer` component. If the user has not liked any properties, it displays a message
indicating that they have 0 liked properties. */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import Spinner from "../../components/Spinner/Spinner";
import Offer from "../../components/Offer/Offer";
import styles from "./MyLikes.module.css";
import { getAuth } from "firebase/auth";

const MyLikes = () => {
    const auth = getAuth();
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const listingRef = collection(db, "listings");
        const likedListingsQuery = query(
            listingRef,
            orderBy("timestamp", "desc"),
        );

/* `const likes = onSnapshot()` is setting up a listener for changes to the `likedListingsQuery` query.
Whenever there is a change in the query results, the callback function is called with a `snapshot`
object that contains the updated data. */
        const likes = onSnapshot(
            likedListingsQuery,
            (snapshot) => {
                const userId = auth.currentUser?.uid;
                if (!userId) return;

                const likedListings = snapshot.docs.filter(
                    (doc) => doc.data().likedBy?.[userId],
                );
                const listings = likedListings.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                setListings(listings);
                setLoading(false);
            },
            (error) => {
                toast.error("Could not fetch listing");
            },
        );

        return likes;
    }, [auth.currentUser]);
    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.heading}>MY LIKES</h1>
                <hr />
                {loading ? (
                    <Spinner />
                ) : listings && listings.length > 0 ? (
                    <>
                        <main>
                            <ul className={styles.list}>
                                {listings.map((listing) => (
                                    <Offer
                                        key={listing.id}
                                        id={listing.id}
                                        listing={listing.data}
                                    />
                                ))}
                            </ul>
                        </main>
                    </>
                ) : (
                    <h3 className={styles.heading}>
                        You have 0 liked properties!
                    </h3>
                )}
            </div>
        </>
    );
};

export default MyLikes;
