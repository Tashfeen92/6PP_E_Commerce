import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { loadUser } from "./actions/userActions.js";
import WebFont from "webfontloader";
import store from "./store";
import Header from "./components/layout/Header/Header.jsx";
import Footer from "./components/layout/Footer/Footer";
import Contact from "./components/layout/Contact/Contact";
import About from "./components/layout/About/About";
import PageNotFound from "./components/layout/PageNotFound/PageNotFound";
import Home from "./components/Home/Home";
import ProductDetails from "./components/Product/ProductDetails.jsx";
import Products from "./components/Product/Products.jsx";
import Search from "./components/Product/Search.jsx";
import LoginSignUp from "./components/User/LoginSignUp.jsx";
import UserOptions from "./components/layout/Header/UserOptions.jsx";
import ProtectedRoute from "./components/Route/ProtectedRoute.jsx";
import Profile from "./components/User/Profile.jsx";
import EditProfile from "./components/User/EditProfile.jsx";
import UpdatePassword from "./components/User/UpdatePassword.jsx";
import ForgotPassword from "./components/User/ForgotPassword.jsx";
import ResetPassword from "./components/User/ResetPassword.jsx";
import Cart from "./components/Cart/Cart.jsx";
import Shipping from "./components/Cart/Shipping.jsx";
import ConfirmOrder from "./components/Cart/ConfirmOrder.jsx";
import Payment from "./components/Cart/Payment.jsx";
import OrderSuccess from "./components/Cart/OrderSuccess.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import MyOrders from "./components/Order/MyOrders.jsx";
import OrderDetails from "./components/Order/OrderDetails.jsx";
import Dashboard from "./components/Admin/Dashboard.jsx";
import ProductList from "./components/Admin/ProductList.jsx";
import NewProduct from "./components/Admin/NewProduct.jsx";
import UpdateProduct from "./components/Admin/UpdateProduct.jsx";
import OrderList from "./components/Admin/OrderList.jsx";
import ProcessOrder from "./components/Admin/ProcessOrder.jsx";
import UserList from "./components/Admin/UserList.jsx";
import UpdateUser from "./components/Admin/UpdateUser.jsx";
import ProductReviewsList from "./components/Admin/ProductReviewsList.jsx";

function App() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  // For Payment Gateway
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    // For Dynamic Font Loading
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sand", "Chilanka"],
      },
    });
    store.dispatch(loadUser()); // Load User First Time the WebSite Loads
    getStripeApiKey(); // Get Stripe Key First Time the WebSite Loads
  }, []);

  // To Prevent Right Click on Your Website
  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        {/* Protected Routes Start */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              loading={loading}
            />
          }
        >
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<EditProfile />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/order/confirm" element={<ConfirmOrder />} />
          {stripeApiKey && (
            <Route
              exact
              path="/process/payment"
              element={
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Payment />
                </Elements>
              }
            />
          )}
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route>
        {/* Protected Routes End */}
        {/* Protected Routes - Admin Only Start */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              adminRoute={true}
              userRole={user && user.role}
              loading={loading}
            />
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/order/:id" element={<ProcessOrder />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/user/:id" element={<UpdateUser />} />
          <Route path="/admin/reviews" element={<ProductReviewsList />} />
        </Route>
        {/* Protected Routes - Admin Only Ends */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
