import "../styles/Listing.css";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
    Autoplay,
    Navigation,
    Pagination,
    EffectFade,
} from "swiper";
import "swiper/css/bundle";
import { FiCopy } from "react-icons/fi";
import {
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaParking,
    FaChair,
} from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import LikeButton from "../components/LikeButton";

const Listing = () => {
    const params = useParams();
    const auth = getAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    useEffect(() => {
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId]);

    const onCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setShareLinkCopied(true);
        setTimeout(() => {
            setShareLinkCopied(false);
        }, 2000);
    };

    if (loading) {
        return <Spinner />;
    }
    return (
        <>
            <Swiper
                slidesPerView={1}
                navigation
                pagination={{ type: "progressbar" }}
                effect="fade"
                modules={[EffectFade]}
                autoplay={{ delay: 3000 }}
            >
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="swiper-div"
                            style={{
                                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                                backgroundSize: "cover",
                            }}
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {auth.currentUser && <LikeButton />}
            <div className="share-btn" onClick={onCopyLink}>
                <FiCopy className="icon" />
            </div>
            {shareLinkCopied && <p className="text-msg">Link Copied</p>}
            <div className="main-listing">
                <div className="details-container">
                    <div className="information-div">
                        <p className="p-info">
                            {listing.name} - ${" "}
                            {listing.offer
                                ? listing.discountedPrice
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                : listing.regularPrice
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            {listing.type === "rent" ? " / month" : ""}
                        </p>
                        <p className="p-info-semi">
                            <FaMapMarkerAlt className="address-point" />
                            {listing.address}
                        </p>
                        <div className="full-info">
                            <p className="listing-type">
                                {listing.type === "rent" ? "Rent" : "Sale"}
                            </p>
                            {listing.offer && (
                                <p className="listing-price">
                                    $
                                    {+listing.regularPrice -
                                        +listing.discountedPrice}{" "}
                                    discount
                                </p>
                            )}
                        </div>
                        <p className="p-desc">
                            <span className="span-desc">Description - </span>
                            {listing.description}
                        </p>
                        <ul className="info-list">
                            <li className="list-item">
                                <FaBed className="icon-info" />
                                {+listing.bedrooms > 1
                                    ? `${listing.bedrooms} Beds`
                                    : "1 Bed"}
                            </li>
                            <li className="list-item">
                                <FaBath className="icon-info" />
                                {+listing.bathrooms > 1
                                    ? `${listing.bathrooms} Baths`
                                    : "1 Bath"}
                            </li>
                            <li className="list-item">
                                <FaParking className="icon-info" />
                                {listing.parking
                                    ? "Parking spot"
                                    : "No parking"}
                            </li>
                            <li className="list-item">
                                <FaChair className="icon-info" />
                                {listing.furnished
                                    ? "Furnished"
                                    : "Not furnished"}
                            </li>
                        </ul>
                        {listing.userRef !== auth.currentUser?.uid &&
                            !contactLandlord &&
                            auth.currentUser && (
                                <div className="contact-div">
                                    <button
                                        onClick={() => setContactLandlord(true)}
                                        className="contact-btn"
                                    >
                                        Contact Landlord
                                    </button>
                                </div>
                            )}
                        {contactLandlord && (
                            <Contact
                                userRef={listing.userRef}
                                listing={listing}
                            />
                        )}
                    </div>
                    <div className="map-div">
                        <MapContainer
                            center={[
                                listing.geolocation.lat,
                                listing.geolocation.lng,
                            ]}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker
                                position={[
                                    listing.geolocation.lat,
                                    listing.geolocation.lng,
                                ]}
                            >
                                <Popup>{listing.address}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Listing;
