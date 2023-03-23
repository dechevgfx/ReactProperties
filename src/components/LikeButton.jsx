import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { AiOutlineHeart } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import "../styles/LikeButton.css";

export default function LikeButton() {
  const params = useParams();
  const auth = getAuth();

  const [listingRef, setListingRef] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      setListingRef(docRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLikes(docSnap.data().likes);
        const likedBy = docSnap.data().likedBy;
        if (likedBy && likedBy[auth.currentUser.uid]) {
          setLiked(true);
        }
      }
    }

    fetchListing();
  }, [params.listingId, auth.currentUser.uid]);

  const handleLike = async () => {
    if (liked) {
      await updateDoc(listingRef, {
        likes: likes - 1,
        [`likedBy.${auth.currentUser.uid}`]: false,
      });
      setLiked(false);
      setLikes((prev) => prev - 1);
    } else {
      await updateDoc(listingRef, {
        likes: likes + 1,
        [`likedBy.${auth.currentUser.uid}`]: true,
      });
      setLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  return liked ? (
    <div className={"liked like-btn"} onClick={handleLike}>
      <AiOutlineHeart className="icon" />
    </div>
  ) : (
    <div className={"like-btn"} onClick={handleLike}>
      <AiOutlineHeart className="icon" />
    </div>
  );
}
