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
import Offer from "../components/Offer";
import Slider from "../components/Slider";
import { db } from "../firebase";
import "../styles/Home.css";

const Home = () => {
    // Offers
    const [offerListings, setOfferListings] = useState(null);
    useEffect(() => {
        async function fetchListings() {
            try {
                // get reference
                const listingsRef = collection(db, "listings");
                // create the query
                const q = query(
                    listingsRef,
                    // where("offer", "==", true),
                    orderBy("timestamp", "desc"),
                    limit(3),
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
        }
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
                    limit(3),
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
                    limit(3),
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
        <div>
            <Slider />
            <div className="recent-container">
                {offerListings && offerListings.length > 0 && (
                    <div className="listings">
                        <h2 className="heading">RECENT LISTINGS</h2>
                        <Link to="/offers">
                            <p className="show-more">Show all listings</p>
                        </Link>
                        <ul className="list">
                            {offerListings.map((listing) => (
                                <Offer
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                />
                            ))}
                        </ul>
                    </div>
                )}
                {rentListings && rentListings.length > 0 && (
                    <div className="listings">
                        <h2 className="heading">FOR RENT</h2>
                        <Link to="/category/rent">
                            <p className="show-more">
                                Show more places for rent
                            </p>
                        </Link>
                        <ul className="list">
                            {rentListings.map((listing) => (
                                <Offer
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                />
                            ))}
                        </ul>
                    </div>
                )}
                {saleListings && saleListings.length > 0 && (
                    <div className="listings">
                        <h2 className="heading">FOR SALE</h2>
                        <Link to="/category/sale">
                            <p className="show-more">
                                Show more places for sale
                            </p>
                        </Link>
                        <ul className="list">
                            {saleListings.map((listing) => (
                                <Offer
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Home;
