import { useState } from "react";
import Spinner from "../components/Spinner";
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
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

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
      toast.error("You can't edit this listing");
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
        navigate("/");
        toast.error("Listing does not exist");
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

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
    if (images.length > 10) {
      setLoading(false);
      toast.error("Upload maximum 10 images!");
      return;
    }
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBow-uELhK9xuCURsIvNSJUdp67slfCVl8`
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
    };

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
    <main className="main">
      <h1 className="heading">Edit Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="p-type">Sell / Rent</p>
        <div className="flex-div">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`btn ${type === "rent" ? "black" : "white"}`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`btn ${type === "sale" ? "black" : "white"}`}
          >
            rent
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
            <div className="">
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
          Edit Listing
        </button>
      </form>
    </main>
  );
};
export default EditListing;
