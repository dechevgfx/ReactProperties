import styles from "./Offer.module.css";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Offer = ({ listing, id, onEdit, onDelete }) => {
    return (
        <li className={styles.liItem}>
            <Link
                className={styles.contents}
                to={`/category/${listing.type}/${id}`}
            >
                <div className={styles.imgContainer}>
                    <img
                        className={styles.img}
                        loading="lazy"
                        src={listing.imgUrls[0]}
                        alt="Listing"
                    />
                    <Moment className={styles.momentItem} fromNow>
                        {listing.timestamp?.toDate()}
                    </Moment>
                </div>
                <div className={styles.infoContainer}>
                    <div className={styles.momentDivContainer}>
                        <div className={styles.momentDiv}>
                            <MdLocationOn className={styles.location} />
                            <p className={styles.locationAddress}>
                                {listing.address}
                            </p>
                        </div>
                        <p className={styles.name}>{listing.name}</p>
                        <p className={styles.price}>
                            $
                            {listing.offer
                                ? listing.discountedPrice
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                : listing.regularPrice
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            {listing.type === "rent" && " / month"}
                        </p>
                        <div className={styles.divProperty}>
                            <div className={styles.bedBath}>
                                <p className={styles.textInfo}>
                                    {listing.bedrooms > 1
                                        ? `${listing.bedrooms} Beds`
                                        : "1 Bed"}
                                </p>
                            </div>
                            <div className={styles.bedBath}>
                                <p className={styles.textInfo}>
                                    {listing.bathrooms > 1
                                        ? `${listing.bathrooms} Baths`
                                        : "1 Bath"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            {onDelete && (
                <FaTrash
                    className={styles.delete}
                    onClick={() => onDelete(listing.id)}
                />
            )}
            {onEdit && (
                <MdEdit
                    className={styles.edit}
                    onClick={() => onEdit(listing.id)}
                />
            )}
        </li>
    );
};
export default Offer;
