/**
 * This is the main App component of a React application that defines the routes and renders different
 * pages based on the URL path.
 */
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Offers from "./pages/Offers/Offers";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Navigation from "./components/Navigation/Navigation";
import Error from "./components/Error/Error";
import PrivateRoute from "./components/Private/Private";
import CreateOffer from "./pages/CreateOffer/CreateOffer";
import EditOffer from "./pages/EditOffer/EditOffer";
import Category from "./pages/Category/Category";
import Listing from "./pages/Listing/Listing";
import MyLikes from "./pages/MyLikes/MyLikes";

function App() {
    return (
        <>
            <Router>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="/my-likes" element={<PrivateRoute />}>
                        <Route path="/my-likes" element={<MyLikes />} />
                    </Route>
                    <Route
                        path="/category/:categoryName/:listingId"
                        element={<Listing />}
                    />
                    <Route path="/offers" element={<Offers />} />
                    <Route
                        path="/category/:categoryName"
                        element={<Category />}
                    />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/create" element={<PrivateRoute />}>
                        <Route path="/create" element={<CreateOffer />} />
                    </Route>
                    <Route path="edit" element={<PrivateRoute />}>
                        <Route
                            path="/edit/:listingId"
                            element={<EditOffer />}
                        />
                    </Route>
                    <Route path="*" element={<Error />} />
                </Routes>
            </Router>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    );
}

export default App;
