import { useState } from "react";
import "./CreateOffer.css";
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
  }
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
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
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

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
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
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="main-offer">
      <h1 className="heading">Create a Offer</h1>
      <form onSubmit={onSubmit}>
        <p className="p-type">Sell / Rent</p>
        <div className="flex-div">
                    <button
                        type="button"
                        id="type"
                        value="sale"
                        onClick={onChange}
                        className={`btn-r ${
                            type === "rent" ? "black" : "white"
                        }`}
                    >
                        SELL
                    </button>
                    <button
                        type="button"
                        id="type"
                        value="rent"
                        onClick={onChange}
                        className={`btn-l ${
                            type === "sale" ? "black" : "white"
                        }`}
                    >
                        RENT
                    </button>
                </div>
        <p className="semibold-p">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          className="text-inputs"
        />
        <p className="semibold-p">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="text-inputs"
        />

        {!geolocationEnabled && (
          <div className="flex-start">
            <div className="">
              <p className="semibold-p">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="input"
              />
            </div>
            <div className="">
              <p className="semibold-p">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="input"
              />
            </div>
          </div>
        )}
        <div>
          <p className="semibold-p">Beds</p>
          <input
            type="number"
            id="bedrooms"
            value={bedrooms}
            onChange={onChange}
            min="1"
            max="50"
            required
            className="input"
          />
        </div>
        <div>
          <p className="semibold-p">Baths</p>
          <input
            type="number"
            id="bathrooms"
            value={bathrooms}
            onChange={onChange}
            min="1"
            max="50"
            required
            className="input"
          />
        </div>
        <p className="semibold-p">Parking spot</p>
        <div className="flex-div">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`btn-r ${!parking ? "black" : "white"}`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`btn-l ${parking ? "black" : "white"}`}
          >
            no
          </button>
        </div>
        <p className="semibold-p">Furnished</p>
        <div className="flex-div">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`btn-r ${!furnished ? "black" : "white"}`}
          >
            yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`btn-l ${furnished ? "black" : "white"}`}
          >
            no
          </button>
        </div>

        <p className="semibold-p">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="text-inputs"
        />
        <p className="semibold-p">Offer</p>
        <div className="offer-div">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`btn-r ${!offer ? "black" : "white"}`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`btn-l ${offer ? "black" : "white"}`}
          >
            no
          </button>
        </div>
        <div className="center-div">
          <div className="">
            <p className="semibold-p">Regular price</p>
            <div className="input-div">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="input"
              />
              {type === "rent" && (
                <div className="">
                  <p className="nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="center-div">
            <div>
              <p className="semibold-p">Discounted price</p>
              <div className="input-div">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required={offer}
                  className="input"
                />
                {type === "rent" && (
                  <div className="">
                    <p className="nowrap">$ / Month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="img-add">
          <p className="semibold-p">Images</p>
          <p className="gray">The first image will be the cover (max 6)</p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="img-input"
          />
        </div>
        <button type="submit" className="submit">
          Create Offer
        </button>
      </form>
    </main>
  );
}
export default CreateOffer;