import "../styles/Profile.css";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { TbHomeDollar } from "react-icons/tb";
import { useEffect } from "react";
import Offer from "../components/Offer";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [changeDetails, setChangeDetails] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { name, email } = formData;
  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name });
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  };

  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  };
  const onEdit = (listingID) => {
    navigate(`/edit/${listingID}`);
  };

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
      <section className="container-profile-edit">
        <h1 className="heading">My Profile</h1>
        <div className="div-form">
          <form>
            {/* Name Input */}

            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetails}
              onChange={onChange}
              className="input"
            />

            {/* Email Input */}

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="input"
            />

            <div className="options-div">
              <p className="p-question">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetails && onSubmit();
                    setChangeDetails((prevState) => !prevState);
                  }}
                  className="txt-red"
                >
                  {changeDetails ? "Apply changes" : "Edit"}
                </span>
              </p>
              <p onClick={onLogout} className="logout">
                Sign out
              </p>
            </div>
          </form>

          <button type="submit" className="sell-button">
            <Link to="/create" className="create-link">
              <TbHomeDollar className="home-icon" />
              ADD PROPERTY TO YOUR LISTINGS
            </Link>
          </button>
        </div>
      </section>

      <div className="my-listings-div">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="listing-heading">My Listings</h2>
            <ul className="list">
              {listings.map((listing) => (
                <Offer
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};
export default Profile;
