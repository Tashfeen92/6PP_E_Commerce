import React, { Fragment, useEffect } from "react";
import "./ProductList.css";
import SideBar from "./Sidebar.jsx";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import {
  getAdminProduct,
  deleteProduct,
  clearErrors,
} from "../../actions/productActions";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import Loading from "../layout/Loading/Loading";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants.js";

const ProductList = () => {
  const { products, error, loading } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.adminProduct
  );
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>
            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];
  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        stock: item.stock,
        price: item.price,
      });
    });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Product Deleted Successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProduct());
  }, [dispatch, alert, error, deleteError, isDeleted, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <MetaData title={`ALL PRODUCTS - Admin`} />
          <div className="dashboard">
            <SideBar />
            <div className="productListContainer">
              <h1 id="productListHeading">ALL PRODUCTS</h1>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                className="productListTable"
                autoHeight
              />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductList;
