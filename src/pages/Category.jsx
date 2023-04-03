import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import Offer from "../components/Offer";
import { useParams } from "react-router-dom";
import "../styles/Category.css";

const Category = () => {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchListing] = useState(null);
    const params = useParams();
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingRef = collection(db, "listings");
                const q = query(
                    listingRef,
                    where("type", "==", params.categoryName),
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
                toast.error("Something happened, try again later.");
            }
        };

        fetchListings();
    }, [params.categoryName]);

    const onFetchMoreListings = async () => {
        try {
            const listingRef = collection(db, "listings");
            const q = query(
                listingRef,
                where("type", "==", params.categoryName),
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
            toast.error("Could not get listing");
        }
    };

    return (
        <div className="container">
            <h1 className="heading">
                {params.categoryName === "rent"
                    ? "Places for rent"
                    : "Places for sale"}
            </h1>
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
                    {lastFetchedListing && (
                            <button
                                type="button"
                                onClick={onFetchMoreListings}
                                id="btn"
                            >
                                Load more
                            </button>
                    )}
                </>
            ) : (
                <p>
                    There are no current{" "}
                    {params.categoryName === "rent"
                        ? "places for rent"
                        : "places for sale"}
                </p>
            )}
        </div>
    );
};

export default Category;
