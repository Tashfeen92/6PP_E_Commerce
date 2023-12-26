import React, { Fragment, useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "./Sidebar.jsx";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import Chart from "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";
import MetaData from "../layout/MetaData.jsx";
import Loading from "../layout/Loading/Loading";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productActions.js";
import { getAllOrders } from "../../actions/orderActions.js";
import { getAllUsers } from "../../actions/userActions.js";

const Dashboard = () => {
  const { products, loading } = useSelector((state) => state.products);
  const { orders, loading: ordersLoading } = useSelector(
    (state) => state.allOrders
  );
  const { users, loading: usersLoading } = useSelector(
    (state) => state.allUsers
  );
  const dispatch = useDispatch();

  let outOfStock = 0;
  products &&
    products.forEach((product) => {
      if (product.stock === 0) outOfStock += 1;
    });

  let totalAmount = 0;
  orders &&
    orders.forEach((order) => {
      totalAmount += Math.floor(order.totalPrice);
    });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <Fragment>
      {loading || ordersLoading || usersLoading ? (
        <Loading />
      ) : (
        <div className="dashboard">
          <MetaData title="Dashboard - Admin Panel" />
          <Sidebar />
          <div className="dashboardContainer">
            <Typography component="h1">Dashboard</Typography>
            <div className="dashboardSummary">
              <div>
                <p>
                  Total Amount <br /> Rs.{totalAmount}
                </p>
              </div>
              <div className="dashboardSummaryBox2">
                <Link to="/admin/products">
                  <p className="my">Product</p>
                  <p>{products && products.length}</p>
                </Link>
                <Link to="/admin/orders">
                  <p className="my">Orders</p>
                  <p>{orders && orders.length}</p>
                </Link>
                <Link to="/admin/users">
                  <p className="my">Users</p>
                  <p>{users && users.length}</p>
                </Link>
              </div>
            </div>
            <div className="lineChart">
              <Line data={lineState} />
            </div>
            <div className="doughnutChart">
              <Doughnut data={doughnutState} />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Dashboard;
