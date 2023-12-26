import React, { Fragment, useEffect } from "react";
import { BiMouse } from "react-icons/bi";
import "./Home.css";
import ProductCard from "./ProductCard.jsx";
import MetaData from "../layout/MetaData";
import { getProduct, clearErrors } from "../../actions/productActions";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../layout/Loading/Loading";
import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <MetaData title="E-COMMERCE" />
          <div className="banner">
            <p>WELCOME TO E-COMMERCE</p>
            <h1>FIND AMAZING PRODUCT BELOW</h1>
            <a href="#container">
              <button>
                Scroll <BiMouse />
              </button>
            </a>
          </div>
          <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
            {products?.map((product) => {
              return <ProductCard key={product._id} product={product} />;
            })}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
