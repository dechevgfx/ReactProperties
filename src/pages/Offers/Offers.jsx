/* `Offers` component fetches and displays a list of offers from a Firebase
Firestore database. It uses the `useEffect` hook to fetch the initial set of offers when the
component mounts, and the `useState` hook to manage the state of the listings, loading status, and
the last fetched listing. It also uses the `react-toastify` library to display error messages. The
component renders a list of `Offer` components and a "Load More" button that fetches additional
offers when clicked. The component also uses CSS modules to style its elements. */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
} from "firebase/firestore";
import { db } from "../../firebase";
import Spinner from "../../components/Spinner/Spinner";
import Offer from "../../components/Offer/Offer";
import styles from "./Offers.module.css";

const Offers = () => {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchListing] = useState(null);
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingRef = collection(db, "listings");
                const q = query(
                    listingRef,
                    orderBy("timestamp", "desc"),
                    limit(4),
                );
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchListing(lastVisible);
                const listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                setListings(listings);
                setLoading(false);
            } catch (error) {
                toast.error("Could not fetch listing");
            }
        };

        fetchListings();
    }, []);

    const onFetchMoreListings = async () => {
        try {
            const listingRef = collection(db, "listings");
            const q = query(
                listingRef,

                orderBy("timestamp", "desc"),
                startAfter(lastFetchedListing),
                limit(2),
            );
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchListing(lastVisible);
            const listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings((prevState) => [...prevState, ...listings]);
            setLoading(false);
        } catch (error) {
            toast.error("Could not fetch listing");
        }
    };

    return (
        <>
            <div className={styles.offersContainer}>
                <h1 className={styles.heading}>OUR OFFERS</h1>
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
                        {lastFetchedListing && (
                            <button
                                type="button"
                                onClick={onFetchMoreListings}
                                className={styles.showMore}
                            >
                                LOAD MORE
                            </button>
                        )}
                    </>
                ) : (
                    <h3 className={styles.heading}>
                        There are no current offers!
                    </h3>
                )}
            </div>
        </>
    );
};
export default Offers;
