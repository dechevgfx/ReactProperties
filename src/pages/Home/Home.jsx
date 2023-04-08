/* This React component fetches and displays listings from a Firebase Firestore
database. It fetches recent listings, places for rent, and places for sale separately using
different queries and displays them in separate sections on the page. It also includes a slider
component at the top of the page. The component uses the useState and useEffect hooks to manage
state and fetch data asynchronously. It also uses the Link component from React Router to create
links to other pages. */
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Offer from "../../components/Offer/Offer";
import Slider from "../../components/Slider/Slider";
import { db } from "../../firebase";
import styles from "./Home.module.css";

const Home = () => {
    // Offers
    const [offerListings, setOfferListings] = useState(null);
    useEffect(() => {
        const fetchListings = async () => {
            try {
                // get reference
                const listingsRef = collection(db, "listings");
                // create the query
                const q = query(
                    listingsRef,
                    // where("offer", "==", true),
                    orderBy("timestamp", "desc"),
                    limit(4),
                );
                // execute the query
                const querySnap = await getDocs(q);
                const listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                setOfferListings(listings);
            } catch (error) {
                console.log(error);
            }
        };
        fetchListings();
    }, []);
    // Places for rent
    const [rentListings, setRentListings] = useState(null);
    useEffect(() => {
        const fetchListings = async () => {
            try {
                // get reference
                const listingsRef = collection(db, "listings");
                // create the query
                const q = query(
                    listingsRef,
                    where("type", "==", "rent"),
                    orderBy("timestamp", "desc"),
                    limit(4),
                );
                // execute the query
                const querySnap = await getDocs(q);
                const listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                setRentListings(listings);
            } catch (error) {
                console.log(error);
            }
        };
        fetchListings();
    }, []);
    // Places for rent
    const [saleListings, setSaleListings] = useState(null);
    useEffect(() => {
        const fetchListings = async () => {
            try {
                // get reference
                const listingsRef = collection(db, "listings");
                // create the query
                const q = query(
                    listingsRef,
                    where("type", "==", "sale"),
                    orderBy("timestamp", "desc"),
                    limit(4),
                );
                // execute the query
                const querySnap = await getDocs(q);
                const listings = [];
                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                setSaleListings(listings);
            } catch (error) {
                console.log(error);
            }
        };
        fetchListings();
    }, []);
    return (
        <>
            <div>
                <Slider />
                <div className={styles.recentContainer}>
                    {offerListings && offerListings.length > 0 ? (
                        <div className={styles.listings}>
                            <h1 className={styles.heading}>RECENT LISTINGS</h1>
                            <hr />

                            <ul className={styles.list}>
                                {offerListings.map((listing) => (
                                    <Offer
                                        key={listing.id}
                                        listing={listing.data}
                                        id={listing.id}
                                    />
                                ))}
                            </ul>
                            <Link to="/offers">
                                <p className={styles.showMore}>
                                    Show all listings
                                </p>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className={styles.listings}>
                                <h1 className={styles.heading}>
                                    RECENT LISTINGS
                                </h1>
                                <hr />
                                <h3 className={styles.heading}>
                                    No listings yet.
                                </h3>
                            </div>
                            <Link to="/profile">
                                <p className={styles.showMore}>
                                BEGIN LISTING YOUR PROPERTIES
                                </p>
                            </Link>
                        </>
                    )}

                    {rentListings && rentListings.length > 0 && (
                        <div className={styles.listings}>
                            <h1 className={styles.heading}>FOR RENT</h1>
                            <hr />

                            <ul className={styles.list}>
                                {rentListings.map((listing) => (
                                    <Offer
                                        key={listing.id}
                                        listing={listing.data}
                                        id={listing.id}
                                    />
                                ))}
                            </ul>
                            <Link to="/category/rent">
                                <p className={styles.showMore}>
                                    Show more places for rent
                                </p>
                            </Link>
                        </div>
                    )}
                    {saleListings && saleListings.length > 0 && (
                        <div className={styles.listings}>
                            <h1 className={styles.heading}>FOR SALE</h1>
                            <hr />

                            <ul className={styles.list}>
                                {saleListings.map((listing) => (
                                    <Offer
                                        key={listing.id}
                                        listing={listing.data}
                                        id={listing.id}
                                    />
                                ))}
                            </ul>
                            <Link to="/category/sale">
                                <p className={styles.showMore}>
                                    Show more places for sale
                                </p>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default Home;
