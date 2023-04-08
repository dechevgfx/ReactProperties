# Project Overview

React Properties is a small-sized web application that enables users to view and contact owners for properties available for rent or sale. The application is built using the React JavaScript library for the frontend, and Firebase for data storage and management.

# Project Architecture

The architecture of the project follows a standard approach commonly used in React-based web applications. The project's root directory is the "src" directory, which contains several sub-directories, including:

## Components:

This directory contains reusable UI components that can be used across different pages of the application. Each component is located in its own sub-folder, and has its own .module.css file that contains the component's styles.

## Pages:

This directory contains the different pages of the application, each located in its own sub-folder. Each page component uses the reusable UI components from the "Components" folder and has its own .module.css file that contains the page's styles.

## Hooks:

This directory contains custom hooks that can be used across different components of the application.

## Assets:

This directory contains the static assets such as images, fonts, and other resources used in the application.

# Dependencies:

-   @testing-library/jest-dom: This is a library used for testing React components.
-   @testing-library/react: This is another library used for testing React components.
-   @testing-library/user-event: This library provides simulation of user events in React components.
-   firebase: This package provides access to the Firebase backend.
-   leaflet: This is a library used for creating interactive maps.
-   react: This is the core library used for building React components.
-   react-dom: This is the DOM-specific package for React, allowing React to be used in a web browser.
-   react-geocode: This package allows for geocoding and reverse geocoding of addresses.
-   react-icons: This is a library of icons that can be used in React components.
-   react-leaflet: This package provides a React wrapper around the Leaflet library.
-   react-loading: This package provides a component for displaying loading spinners.
-   react-moment: This package provides a component for formatting dates and times.
-   react-router: This is a library used for handling client-side routing in React applications.
-   react-router-dom: This is a library that provides a set of higher-order components for routing in React applications.
-   react-scripts: This package provides scripts and configuration used by Create React App.
-   react-toastify: This package provides a component for displaying toast messages.
-   swiper: This package provides a touch-enabled slider component for React.
-   uuid: This package provides functions for generating UUIDs.
-   web-vitals: This package provides tools for measuring the performance of web pages.

# Public and private part

## Home (public)

![Home page](https://drive.google.com/file/d/1gBiafiZaJCPU-v2J9Pr4_RW0MGfljegO/view?usp=share_link)

-   This is a React component that fetches and displays listings from a Firebase Firestore database. It uses different queries to fetch recent listings, places for rent, and places for sale separately, and displays them in separate sections on the page. It also includes a slider component at the top of the page. The component uses the useState and useEffect hooks to manage state and fetch data asynchronously. It also uses the Link component from React Router to create links to other pages.

## Offers (public)

![Offers page](https://drive.google.com/file/d/1AJwxor6-MQJnYG1K0TNq6k8k6HSUDmo5/view?usp=share_link)

-   Offers component fetches a list of offers from a Firebase Firestore database, and displays them using the Offer component. It also uses react-toastify to display error messages.
-   The component uses the useEffect hook to fetch the initial set of offers when it mounts, and the useState hook to manage the state of the listings, loading status, and the last fetched listing. It renders a list of Offer components and a "Load More" button that fetches additional offers when clicked.

## Navigation (public)

![Public navigation](https://drive.google.com/file/d/13hrOugWtUZr2jpggME9CBAGFA3yjxbzp/view?usp=share_link)

The public navigation is rendered when the user is not authenticated. It displays the following links:

-   HOME: navigates to the home page
-   OFFERS: navigates to the offers page
-   SIGN IN: navigates to the sign-in page

## Navigation (private)

![Private navigation](https://drive.google.com/file/d/1aricgUE6RsOoU3Ri06QYczz9TaAdY7w8/view?usp=share_link)

The private navigation is rendered when the user is authenticated. It displays the following links:

-   HOME: navigates to the home page
-   OFFERS: navigates to the offers page
-   LIKES: navigates to the user's likes page
-   PROFILE: navigates to the user's profile page

If the user is not authenticated, the LIKES and PROFILE links are not displayed.

The pathMatch function is used to determine if the current route matches a given path and apply a CSS class to the corresponding navigation link. The CSS styles for the component are imported from a separate CSS module file.

## Listing (public)

![Public listing](https://drive.google.com/file/d/1xMQwVxM6ZHwBiefdMzTt9FoYHa4dmQPh/view?usp=share_link)

The public part of the listing is everything that is displayed on the page regardless of whether the user is logged in or not. This includes the following components:

-   Swiper component: It displays the listing images in a slide show format.
-   Listing details such as price, address, bedrooms, bathrooms, parking, and furnishing.
-   Map component: It displays a map with a marker at the listing location.

## Listing (private)

![Private listing non-owner](https://drive.google.com/file/d/1B5epcDZ1Afm1sY9emLLEnw6poH1iJcQl/view?usp=share_link)

![Private listing owner](https://drive.google.com/file/d/1nou9SpHFw_lhj_YAidDyrX-tLRmZPjPn/view?usp=share_link)

The private part of the listing is the LikeButton and Contact components, which are only visible to logged-in users.

-   LikeButton component: It allows the logged-in user to like the listing.
-   Contact component: It allows the logged-in user to contact the owner of the listing. This component is only visible if the logged-in user is not the owner of the listing.

## Likes (private only)

![Private likes](https://drive.google.com/file/d/1mlE2UiFLa6NndDvztu4NslOumXSFAnbm/view?usp=share_link)

-   The MyLikes component displays a list of properties that the authenticated user has liked.

## Profile (private only)

![Profile page](https://drive.google.com/file/d/17dDMtGipfeRuwC-amxGiNcC_UnfOfoxp/view?usp=share_link)

-   "Profile" React component that displays the user's profile information and their listings, and allows the user to edit their profile details, add new listings, and delete existing listings. It uses Firebase authentication and Firestore database to fetch and update data, and React Router to navigate between different pages.
-   The component renders a form with input fields for the user's name and email, and a button to sign out. It also renders a button to add a new listing and a list of the user's existing listings. The component uses the Offer component to display each listing and provides functionality to delete.

### Profile Functionality

-   ADD PROPERTY TO YOUR LISTINGS Button: This button allows the user to add a new listing to their existing listings. Clicking on this button redirects the user to the Create Listing page.

    ![Create button](https://drive.google.com/file/d/1K-WnFlgK2X89SPseRLF762aEzX7Hh2Vg/view?usp=share_link)

-   Edit Button: This button allows the user to edit their name in the form. Clicking on this button changes the state of changeDetails to true, enabling the name field to be editable. Clicking on this button again changes the state back to false, disabling the name field, and updating the user's name in Firebase authentication and Firestore if any changes have been made.

    ![Edit profile button](https://drive.google.com/file/d/1tD6NBGtaVigB-TDk43dew8Cbi43UOIlI/view?usp=share_link)

-   Apply Changes Button: This button is only visible when the user has clicked on the Edit button and made some changes to their name. Clicking on this button updates the user's name in Firebase authentication and Firestore with the new name that the user has provided.

    ![Apply changes](https://drive.google.com/file/d/1crRbo71atNJgloNX8u1Uuxt9qPjnyP-N/view?usp=share_link)

    ![Applied changes](https://drive.google.com/file/d/1I-Zl8VOdVJhqZXbemwvZgmdSjOhC8bHH/view?usp=share_link)

-   Sign out Button: Clicking on this button signs the user out of their account and redirects them to the home page.

    ![SignOut button](https://drive.google.com/file/d/1q_xaOj_GstgLABZrV93kP2fzy0FFsFgW/view?usp=share_link)

### Edit and Delete

![Edit and delete buttons](https://drive.google.com/file/d/1u0Bz4MvnpLfJ2JM_oZs-_7I-HKaHk2g7/view?usp=share_link)

-   Edit Button: This button appears next to each listing and allows the user to edit the listing. Clicking on this button redirects the user to the Edit Listing page.

    ![Edit page](https://drive.google.com/file/d/1fhhkv8CNkAsqhJfbp-c3rRZRZ4-KpdE7/view?usp=share_link)

-   Delete Button: This button appears next to each listing and allows the user to delete the listing. Clicking on this button prompts the user with a confirmation message, and if the user confirms, the listing is deleted from Firestore.

    ![Delete confirm](https://drive.google.com/file/d/1KA1XYHQATQD5XIXV2hVUgOdxMiTne68g/view?usp=share_link)
