import "./Offer.css";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Offer = ({ listing, id, onEdit, onDelete }) => {
    return (
        <>
            <li className="li-item">
                <Link
                    className="contents"
                    to={`/category/${listing.type}/${id}`}
                >
                    <div className="img-container">
                        <img
                            className="img"
                            loading="lazy"
                            src={listing.imgUrls[0]}
                            alt="Listing"
                        />
                        <Moment className="moment-item" fromNow>
                            {listing.timestamp?.toDate()}
                        </Moment>
                    </div>
                    <div className="info-container">
                        <div className="moment-div-container">
                            <div className="moment-div">
                                <MdLocationOn className="location" />
                                <p className="location-address">
                                    {listing.address}
                                </p>
                            </div>
                            <p className="name">{listing.name}</p>
                            <p className="price">
                                $
                                {listing.offer
                                    ? listing.discountedPrice
                                          .toString()
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    : listing.regularPrice
                                          .toString()
                                          .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ",",
                                          )}
                                {listing.type === "rent" && " / month"}
                            </p>
                            <div className="div-property">
                                <div className="bed-bath">
                                    <p className="text-info">
                                        {listing.bedrooms > 1
                                            ? `${listing.bedrooms} Beds`
                                            : "1 Bed"}
                                    </p>
                                </div>
                                <div className="bed-bath">
                                    <p className="text-info">
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
                        className="delete"
                        onClick={() => onDelete(listing.id)}
                    />
                )}
                {onEdit && (
                    <MdEdit
                        className="edit"
                        onClick={() => onEdit(listing.id)}
                    />
                )}
            </li>
        </>
    );
};
export default Offer;
