/* This React component implements a like button functionality for a listing. It imports
necessary functions and modules from Firebase and React, including `doc`, `getDoc`, `updateDoc`,
`deleteDoc` from `firebase/firestore`, `useState`, `useEffect`, and `useParams` from `react`, `db`
from `../../firebase`, `AiOutlineLike` from `react-icons/ai`, and `getAuth` from `firebase/auth`. */
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { AiOutlineLike } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import styles from "./LikeButton.module.css";

const LikeButton = () => {
    const params = useParams();
    const auth = getAuth();

    const [listingRef, setListingRef] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    /* `useEffect` is used to fetch the listing data from Firebase and update the state
    variables `listingRef`, `likes`, and `liked` accordingly. */
    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            setListingRef(docRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLikes(docSnap.data().likes || 0);
                const likedBy = docSnap.data().likedBy || {};
                if (auth.currentUser && likedBy[auth.currentUser.uid]) {
                    setLiked(true);
                }
            }
        };

        fetchListing();
    }, [params.listingId, auth.currentUser]);

    /**
     * This function handles the like functionality for a listing, updating the likes count and
     * adding/removing the user's like from the database.
     */
    const handleLike = async () => {
        if (auth.currentUser && !liked) {
            const userId = auth.currentUser.uid;
            await updateDoc(listingRef, {
                likes: likes + 1,
                [`likedBy.${userId}`]: true,
            });
            setLiked(true);
            setLikes((prev) => prev + 1);

            const likeRef = doc(listingRef, "likes", userId);
            await updateDoc(likeRef, {
                userId,
                createdAt: new Date(),
            });
        } else if (auth.currentUser && liked) {
            const userId = auth.currentUser.uid;
            await updateDoc(listingRef, {
                likes: likes - 1,
                [`likedBy.${userId}`]: false,
            });
            setLiked(false);
            setLikes((prev) => prev - 1);

            const likeRef = doc(listingRef, "likes", userId);
            await deleteDoc(likeRef);
        }
    };

    return (
        <>
            {" "}
            <div
                className={`${styles.likeBtn} ${liked ? styles.liked : ""}`}
                onClick={handleLike}
            >
                <AiOutlineLike className={styles.icon} />
            </div>
        </>
    );
};
export default LikeButton;
