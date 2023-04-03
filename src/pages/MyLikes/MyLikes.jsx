import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import Spinner from "../../components/Spinner/Spinner";
import Offer from "../../components/Offer/Offer";
import "./MyLikes.css";
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

        const unsubscribe = onSnapshot(
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

        return unsubscribe;
    }, [auth.currentUser]);
    return (
        <>
            <div className="container">
                <h1 className="heading">MY LIKES</h1>
                {loading ? (
                    <Spinner />
                ) : listings && listings.length > 0 ? (
                    <>
                        <main>
                            <ul className="list">
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
                    <p>You have 0 liked properties</p>
                )}
            </div>
        </>
    );
};

export default MyLikes;