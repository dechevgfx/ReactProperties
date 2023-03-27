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
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import Offer from "../components/Offer";
import "../styles/Offers.css";

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(listingRef, orderBy("timestamp", "desc"), limit(6));
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
    }

    fetchListings();
  }, []);

  const onFetchMoreListings = async () => {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,

        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(3)
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
    <div className="container">
      <h1 className="heading">Offers</h1>
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
            <div className="more">
              <button onClick={onFetchMoreListings} className="btn">
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};
export default Offers;
