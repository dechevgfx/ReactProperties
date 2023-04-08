/* This React component allows users to create a new offer for a real estate
listing. It includes a form with various input fields such as type (rent or sale), name, address,
number of bedrooms and bathrooms, parking availability, furnished status, description, offer
(whether there is a discount available), regular price, discounted price (if applicable), and
images. The component uses Firebase for storage and authentication, and also includes geolocation
functionality to automatically determine the latitude and longitude of the address entered by the
user. Once the form is submitted, the data is stored in a Firestore database */
import { useState } from "react";
import styles from "./CreateOffer.module.css";
import { toast } from "react-toastify";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

const CreateOffer = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        address: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        description: "",
        offer: false,
        regularPrice: 1000,
        discountedPrice: 900,
        latitude: 0,
        longitude: 0,
        images: {},
    });
    const {
        type,
        name,
        address,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        description,
        offer,
        regularPrice,
        discountedPrice,
        latitude,
        longitude,
        images,
    } = formData;
    /**
     * The function updates form data based on the type of input received from the user, including
     * handling boolean values and file uploads.
     */
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
    /**
     * This function handles the submission of a form for creating a new listing, including validation,
     * image storage, and database insertion.
     * @returns The function `onSubmit` does not have a return statement, so it does not explicitly return
     * anything. However, it may return a promise if the `Promise.all` call inside it resolves
     * successfully.
     */
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
            toast.error("maximum 6 images are allowed");
            return;
        }

        /* The below code is checking if geolocation is enabled. If it
        is enabled, it fetches the latitude and longitude of a given address using the Google Maps
        API and stores it in the `geolocation` object. If the address is not found, it sets the
        `location` variable to undefined and displays an error message using the `toast` function.
        If geolocation is not enabled, it uses the provided `latitude` and `longitude` values. */
        let geolocation = {};
        let location;
        if (geolocationEnabled) {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
            );
            const data = await response.json();
            console.log(data);
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
            location = data.status === "ZERO_RESULTS" && undefined;

            if (location === undefined) {
                setLoading(false);
                toast.error("please enter a correct address");
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        /**
         * This function stores an image in Firebase storage and returns its download URL.
         * @returns The `storeImage` function is returning a Promise that resolves with the download
         * URL of the uploaded image.
         */
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
        /* The images, discountedPrice, latitude, and longitude properties are removed from formDataCopy
         using the delete operator. This is likely to clean up the
         object and remove any unnecessary properties. */
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        const docRef = await addDoc(collection(db, "listings"), formDataCopy);
        setLoading(false);
        toast.success("Listing created");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    };

    if (loading) {
        return <Spinner />;
    }
    return (
        <main className={styles.mainOffer}>
            <h1 className={styles.heading}>Create a Offer</h1>
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
                        <div className="">
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
                        <div className="">
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
                        Yes
                    </button>
                    <button
                        type="button"
                        id="parking"
                        value={false}
                        onClick={onChange}
                        className={`${styles.btnL} ${
                            parking ? styles.black : styles.white
                        }`}
                    >
                        no
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
                        Yes
                    </button>
                    <button
                        type="button"
                        id="furnished"
                        value={false}
                        onClick={onChange}
                        className={`${styles.btnL} ${
                            furnished ? styles.black : styles.white
                        }`}
                    >
                        No
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
                        Yes
                    </button>
                    <button
                        type="button"
                        id="offer"
                        value={false}
                        onClick={onChange}
                        className={`${styles.btnL} ${
                            offer ? styles.black : styles.white
                        }`}
                    >
                        No
                    </button>
                </div>

                <div className={styles.centerDiv}>
                    <div className="">
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
                                    <div>
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
                    Create Offer
                </button>
            </form>
        </main>
    );
};
export default CreateOffer;
