/* This React component displays the user's profile information and their listings.
It allows the user to edit their profile details, add new listings, and delete existing listings.
The component uses Firebase authentication and Firestore database to fetch and update data. It also
uses React Router to navigate between different pages. The component renders a form with input
fields for the user's name and email, and a button to sign out. It also renders a button to add a
new listing and a list of the user's existing listings. The component uses the Offer component to
display each listing and provides functionality to delete */
import styles from "./Profile.module.css";
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
import { db } from "../../firebase";
import { TbHomeDollar } from "react-icons/tb";
import { useEffect } from "react";
import Offer from "../../components/Offer/Offer";

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
    const onLogout = () => {
        auth.signOut();
        navigate("/");
    };

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
                (listing) => listing.id !== listingID,
            );
            setListings(updatedListings);
            toast.success("Successfully deleted the listing");
        }
    };

    const onEdit = (listingID) => {
        navigate(`/edit/${listingID}`);
    };

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingRef = collection(db, "listings");
            const q = query(
                listingRef,
                where("userRef", "==", auth.currentUser.uid),
                orderBy("timestamp", "desc"),
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
        };
        fetchUserListings();
    }, [auth.currentUser.uid]);

    return (
        <>
            <section className={styles.containerProfileEdit}>
                <h1 className={styles.heading}>MY PROFILE</h1>
                <hr />
                <div className={styles.divForm}>
                    <form>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                disabled={!changeDetails}
                                onChange={onChange}
                                className={styles.input}
                            />

                            <input
                                type="email"
                                id="email"
                                value={email}
                                disabled
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.optionsDiv}>
                            <p className={styles.pQuestion}>
                                Do you want to change your name?
                                <span
                                    onClick={() => {
                                        changeDetails && onSubmit();
                                        setChangeDetails(
                                            (prevState) => !prevState,
                                        );
                                    }}
                                    className={styles.txtRed}
                                >
                                    {changeDetails ? "Apply changes" : "Edit"}
                                </span>
                            </p>
                        </div>
                        <p onClick={onLogout} className={styles.logout}>
                            Sign out
                        </p>
                    </form>
                    <button type="submit" className={styles.sellButton}>
                        <Link to="/create" className={styles.createLink}>
                            <TbHomeDollar className={styles.homeIcon} />
                            ADD PROPERTY TO YOUR LISTINGS
                        </Link>
                    </button>
                </div>
            </section>

            <div className={styles.myListingsDiv}>
                {!loading && listings.length > 0 && (
                    <>
                        <h2 className={styles.listingHeading}>My Listings</h2>
                        <ul className={styles.list}>
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
