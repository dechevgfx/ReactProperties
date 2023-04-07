import styles from "./Slider.module.css";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import Spinner from "../Spinner/Spinner";
import { db } from "../../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
    // EffectCube,
    Autoplay,
    Navigation,
    Pagination,
    EffectFade,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";

const Slider = () => {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    SwiperCore.use([Autoplay, Navigation, Pagination]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, "listings");
            const q = query(
                listingsRef,
                orderBy("timestamp", "desc"),
                limit(5),
            );
            const querySnap = await getDocs(q);
            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings(listings);
            setLoading(false);
        };
        fetchListings();
    }, []);
    if (loading) {
        return <Spinner />;
    }
    if (listings.length === 0) {
        return <></>;
    }

    return (
        listings && (
            <>
                <Swiper
                    slidesPerView={1}
                    navigation
                    pagination={{ type: "progressbar" }}
                    effect="fade"
                    modules={[EffectFade]}
                    autoplay={{ delay: 3000 }}
                >
                    {listings.map(({ data, id }) => (
                        <SwiperSlide
                            key={id}
                            onClick={() =>
                                navigate(`/category/${data.type}/${id}`)
                            }
                        >
                            <div
                                style={{
                                    background: `url(${data.imgUrls[0]}) center, no-repeat`,
                                    backgroundSize: "cover",
                                }}
                                className={styles.imgDiv}
                            ></div>
                            <p className={styles.pName}>{data.name}</p>
                            <p className={styles.pLikes}>
                                {data.likes ? data.likes : 0} likes
                            </p>
                            <p className={styles.pPrice}>
                                ${data.discountedPrice ?? data.regularPrice}
                                {data.type === "rent" && " / month"}
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        )
    );
};
export default Slider;
