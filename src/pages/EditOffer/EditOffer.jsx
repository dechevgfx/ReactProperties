import { useState } from "react";
import { toast } from "react-toastify";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "../../components/Spinner/Spinner";
import styles from "./EditOffer.module.css";

const EditListing = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {},
    });
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        address,
        furnished,
        description,
        offer,
        regularPrice,
        discountedPrice,
        latitude,
        longitude,
        images,
    } = formData;

    const params = useParams();

    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error("You are not authorized to edit this listing!");
            navigate("/");
        }
    }, [auth.currentUser.uid, listing, navigate]);

    useEffect(() => {
        setLoading(true);
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({ ...docSnap.data() });
                setLoading(false);
            } else {
                navigate("/profile");
                toast.error("Listing does not exist");
            }
        };
        fetchListing();
    }, [navigate, params.listingId]);

    const btnClass = type === "rent" ? styles.black : styles.white;

    const onChange = (e) => {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false;
        }
        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }
        // Text/Boolean/Number
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (+discountedPrice >= +regularPrice) {
            setLoading(false);
            toast.error("Discounted price needs to be less than regular price");
            return;
        }
        if (images.length > 6) {
            setLoading(false);
            toast.error("Upload maximum 6 images!");
            return;
        }
        let geolocation = {};
        let location;
        if (geolocationEnabled) {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBow-uELhK9xuCURsIvNSJUdp67slfCVl8`,
            );
            const data = await response.json();
            console.log(data);
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULTS" && undefined;

            if (location === undefined) {
                setLoading(false);
                toast.error("Address not found, please try again!");
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${
                    image.name
                }-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        console.log("Upload is " + progress + "% done");
                        // eslint-disable-next-line default-case
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL) => {
                                resolve(downloadURL);
                            },
                        );
                    },
                );
            });
        };

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image)),
        ).catch((error) => {
            setLoading(false);
            toast.error("Images not uploaded");
            return;
        });

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        };
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        const docRef = doc(db, "listings", params.listingId);

        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success("Listing Edited");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    };

    if (loading) {
        return <Spinner />;
    }
    return (
        <main className={styles.mainOffer}>
            <h1 className={styles.heading}>Edit Listing</h1>
            <hr />
            <form onSubmit={onSubmit}>
                <p className={styles.pType}>Sell / Rent</p>
                <div className={styles.flexDiv}>
                    <button
                        type="button"
                        id="type"
                        value="sale"
                        onClick={onChange}
                        className={`${styles.btnR} ${
                            type === "rent" ? styles.black : styles.white
                        }`}
                    >
                        SELL
                    </button>
                    <button
                        type="button"
                        id="type"
                        value="rent"
                        onClick={onChange}
                        className={`${styles.btnL} ${
                            type === "sale" ? styles.black : styles.white
                        }`}
                    >
                        RENT
                    </button>
                </div>
                <p className={styles.semiboldP}>Name</p>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Name"
                    maxLength="32"
                    minLength="10"
                    required
                    className={styles.textInputs}
                />

                <p className={styles.semiboldP}>Address</p>
                <textarea
                    type="text"
                    id="address"
                    value={address}
                    onChange={onChange}
                    placeholder="Address"
                    required
                    className={styles.textInputs}
                />
                {!geolocationEnabled && (
                    <div className={styles.flexStart}>
                        <div>
                            <p className={styles.semiboldP}>Latitude</p>
                            <input
                                type="number"
                                id="latitude"
                                value={latitude}
                                onChange={onChange}
                                required
                                min="-90"
                                max="90"
                                className={styles.input}
                            />
                        </div>
                        <div>
                            <p className={styles.semiboldP}>Longitude</p>
                            <input
                                type="number"
                                id="longitude"
                                value={longitude}
                                onChange={onChange}
                                required
                                min="-180"
                                max="180"
                                className={styles.input}
                            />
                        </div>
                    </div>
                )}
                <div>
                    <p className={styles.semiboldP}>Beds</p>
                    <input
                        type="number"
                        id="bedrooms"
                        value={bedrooms}
                        onChange={onChange}
                        min="1"
                        max="50"
                        required
                        className={styles.input}
                    />
                </div>
                <div>
                    <p className={styles.semiboldP}>Baths</p>
                    <input
                        type="number"
                        id="bathrooms"
                        value={bathrooms}
                        onChange={onChange}
                        min="1"
                        max="50"
                        required
                        className={styles.input}
                    />
                </div>
                <p className={styles.semiboldP}>Parking spot</p>
                <div className={styles.flexDiv}>
                    <button
                        type="button"
                        id="parking"
                        value={true}
                        onClick={onChange}
                        className={`${styles.btnR} ${
                            !parking ? styles.black : styles.white
                        }`}
                    >
                        YES
                    </button>
                    <button
                        type="button"
                        id="parking"
                        value={false}
                        onClick={onChange}
                        className={`${styles.btnR} ${
                            parking ? styles.black : styles.white
                        }`}
                    >
                        NO
                    </button>
                </div>
                <p className={styles.semiboldP}>Furnished</p>
                <div className={styles.flexDiv}>
                    <button
                        type="button"
                        id="furnished"
                        value={true}
                        onClick={onChange}
                        className={`${styles.btnR} ${
                            !furnished ? styles.black : styles.white
                        }`}
                    >
                        YES
                    </button>
                    <button
                        type="button"
                        id="furnished"
                        value={false}
                        onClick={onChange}
                        className={`${styles.btnR} ${
                            furnished ? styles.black : styles.white
                        }`}
                    >
                        no
                    </button>
                </div>

                <p className={styles.semiboldP}>Description</p>
                <textarea
                    type="text"
                    id="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Description"
                    required
                    className={styles.textInputs}
                />
                <p className={styles.semiboldP}>Offer</p>
                <div className={styles.offerDiv}>
                    <button
                        type="button"
                        id="offer"
                        value={true}
                        onClick={onChange}
                        className={`${styles.btnR} ${
                            !offer ? styles.black : styles.white
                        }`}
                    >
                        yes
                    </button>
                    <button
                        type="button"
                        id="offer"
                        value={false}
                        onClick={onChange}
                        className={`${styles.btnR} ${
                            offer ? styles.black : styles.white
                        }`}
                    >
                        no
                    </button>
                </div>
                <div className={styles.centerDiv}>
                    <div>
                        <p className={styles.semiboldP}>Regular price</p>
                        <div className={styles.inputDiv}>
                            <input
                                type="number"
                                id="regularPrice"
                                value={regularPrice}
                                onChange={onChange}
                                min="50"
                                max="400000000"
                                required
                                className={styles.input}
                            />
                            {type === "rent" && (
                                <div className="">
                                    <p className={styles.nowrap}>$ / Month</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {offer && (
                    <div className={styles.centerDiv}>
                        <div>
                            <p className={styles.semiboldP}>Discounted price</p>
                            <div className={styles.inputDiv}>
                                <input
                                    type="number"
                                    id="discountedPrice"
                                    value={discountedPrice}
                                    onChange={onChange}
                                    min="50"
                                    max="400000000"
                                    required={offer}
                                    className={styles.input}
                                />
                                {type === "rent" && (
                                    <div className="">
                                        <p className={styles.nowrap}>
                                            $ / Month
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className={styles.imgAdd}>
                    <p className={styles.semiboldP}>Images</p>
                    <p className={styles.gray}>
                        The first image will be the cover (max 6)
                    </p>
                    <input
                        type="file"
                        id="images"
                        onChange={onChange}
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                        className={styles.imgInput}
                    />
                </div>
                <button type="submit" className={styles.submit}>
                    Edit Listing
                </button>
            </form>
        </main>
    );
};
export default EditListing;
