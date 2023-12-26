import React, { Fragment, useEffect, useState } from 'react'
import './Products.css'
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProduct, clearErrors } from '../../actions/productActions.js';
import Loading from "../layout/Loading/Loading.jsx";
import ProductCard from '../Home/ProductCard.jsx'
import MetaData from '../layout/MetaData.jsx';
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { useAlert } from 'react-alert';

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
];

const Products = () => {

    const params = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

    const { products, loading, error, productsCount, resultsPerPage, filteredProductsCount } = useSelector((state) => state.products);

    const keyword = params.keyword;
    let count = filteredProductsCount;

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice);
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            clearErrors();
        }
        dispatch(getProduct(keyword, currentPage, price, category, ratings))
    }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

    return (
        <Fragment>
            {
                loading ? (<Loading />) : (
                    <Fragment>
                        <MetaData title="PRODUCTS -- E-COMMERCE" />
                        <h2 className="productsHeading">Products</h2>
                        <div className="products">
                            {products &&
                                products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                        </div>

                        {/* Product Filters */}
                        <div className="filterBox">
                            <Typography>Price</Typography>
                            <Slider
                                value={price}
                                onChange={priceHandler}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                min={0}
                                max={25000}
                            />
                            <Typography>Categories</Typography>
                            <ul className="categoryBox">
                                {categories.map((category) => (
                                    <li
                                        className="category-link"
                                        key={category}
                                        onClick={() => setCategory(category)}
                                    >
                                        {category}
                                    </li>
                                ))}
                            </ul>
                            <fieldset>
                                <Typography component="legend">Ratings Above</Typography>
                                <Slider
                                    value={ratings}
                                    onChange={(e, newRating) => {
                                        setRatings(newRating);
                                    }}
                                    aria-labelledby="continuous-slider"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={5}
                                />
                            </fieldset>
                        </div>
                        {/* Product Pagination */}
                        {resultsPerPage < count && (
                            <div className="paginationBox">
                                <Pagination
                                    activePage={currentPage}
                                    itemsCountPerPage={resultsPerPage}
                                    totalItemsCount={productsCount}
                                    onChange={setCurrentPageNo}
                                    nextPageText="Next"
                                    prevPageText="Prev"
                                    firstPageText="1st"
                                    lastPageText="Last"
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    activeClass="pageItemActive"
                                    activeLinkClass="pageLinkActive"
                                />
                            </div>
                        )}
                    </Fragment>
                )
            }
        </Fragment>
    )
}

export default Products