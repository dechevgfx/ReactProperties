import "../styles/Contact.css";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    }
    getLandlord();
  }, [userRef]);
  function onChange(e) {
    setMessage(e.target.value);
  }
  return (
    <>
      {landlord !== null && (
        <div className="container">
          <p>
            Contact {landlord.name} for the {listing.name.toLowerCase()}
          </p>
          <div className="contact-div">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="msg-box"
            ></textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              className="contact-btn"
              type="button"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
}
