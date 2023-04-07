import styles from "./Listing.module.css";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import { db } from "../../firebase";
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
import Contact from "../../components/Contact/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import LikeButton from "../../components/LikeButton/LikeButton";

const Listing = () => {
    const params = useParams();
    const auth = getAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        };
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
                            className={styles.swiperDiv}
                            style={{
                                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                                backgroundSize: "cover",
                            }}
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {auth.currentUser && <LikeButton />}
            <div className={styles.shareBtn} onClick={onCopyLink}>
                <FiCopy className={styles.icon} />
            </div>
            {shareLinkCopied && <p className={styles.textMsg}>Link Copied</p>}
            <div className={styles.mainListing}>
                <div className={styles.detailsContainer}>
                    <div className={styles.informationDiv}>
                        <p className={styles.pInfo}>
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
                        <p className={styles.pInfoSemi}>
                            <FaMapMarkerAlt className={styles.addressPoint} />
                            {listing.address}
                        </p>
                        <div className={styles.fullInfo}>
                            <p className={styles.listingType}>
                                {listing.type === "rent" ? "Rent" : "Sale"}
                            </p>
                            {listing.offer && (
                                <p className={styles.listingPrice}>
                                    $
                                    {+listing.regularPrice -
                                        +listing.discountedPrice}{" "}
                                    discount
                                </p>
                            )}
                        </div>

                        <ul className={styles.infoList}>
                            <li className={styles.listItem}>
                                <FaBed className={styles.iconInfo} />
                                {+listing.bedrooms > 1
                                    ? `${listing.bedrooms} Beds`
                                    : "1 Bed"}
                            </li>
                            <li className={styles.listItem}>
                                <FaBath className={styles.iconInfo} />
                                {+listing.bathrooms > 1
                                    ? `${listing.bathrooms} Baths`
                                    : "1 Bath"}
                            </li>
                            <li className={styles.listItem}>
                                <FaParking className={styles.iconInfo} />
                                {listing.parking
                                    ? "Parking spot"
                                    : "No parking"}
                            </li>
                            <li className={styles.listItem}>
                                <FaChair className={styles.iconInfo} />
                                {listing.furnished
                                    ? "Furnished"
                                    : "Not furnished"}
                            </li>
                        </ul>
                        <p className={styles.pDesc}>
                            <span className={styles.spanDesc}>
                                Description -{" "}
                            </span>
                            {listing.description}
                        </p>
                        {listing.userRef !== auth.currentUser?.uid &&
                            !contactLandlord &&
                            auth.currentUser && (
                                <div className={styles.contactDiv}>
                                    <button
                                        onClick={() => setContactLandlord(true)}
                                        className={styles.contactBtn}
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
                    <div className={styles.mapDiv}>
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
