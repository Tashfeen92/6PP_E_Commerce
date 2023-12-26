import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import SideBar from "./Sidebar";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../actions/orderActions";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../layout/Loading/Loading";
import { useAlert } from "react-alert";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import "./ProcessOrder.css";

const ProcessOrder = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.adminOrders
  );

  const dispatch = useDispatch();
  const alert = useAlert();
  let params = useParams();
  const [orderStatus, setOrderStatus] = useState("");

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("orderStatus", orderStatus);
    dispatch(updateOrder(params.id, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(params.id));
  }, [dispatch, alert, error, params.id, isUpdated, updateError]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <MetaData title="Process Order" />
          <div className="dashboard">
            <SideBar />
            <div className="newProductContainer">
              {loading ? (
                <Loading />
              ) : (
                <div
                  className="confirmOrderPage"
                  style={{
                    display:
                      order && order.orderStatus === "delivered"
                        ? "block"
                        : "grid",
                  }}
                >
                  <div>
                    <div className="confirmshippingArea">
                      <Typography>Shipping Info</Typography>
                      <div className="orderDetailsContainerBox">
                        <div>
                          <p>Name:</p>
                          <span>{order && order.user && order.user.name}</span>
                        </div>
                        <div>
                          <p>Phone:</p>
                          <span>
                            {order &&
                              order.shippingInfo &&
                              order.shippingInfo.phoneNo}
                          </span>
                        </div>
                        <div>
                          <p>Address:</p>
                          <span>
                            {order &&
                              order.shippingInfo &&
                              `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                          </span>
                        </div>
                      </div>

                      <Typography>Payment</Typography>
                      <div className="orderDetailsContainerBox">
                        <div>
                          <p
                            className={
                              order &&
                              order.paymentInfo &&
                              order.paymentInfo.status === "succeeded"
                                ? "greenColor"
                                : "redColor"
                            }
                          >
                            {order &&
                            order.paymentInfo &&
                            order.paymentInfo.status === "succeeded"
                              ? "PAID"
                              : "NOT PAID"}
                          </p>
                        </div>

                        <div>
                          <p>Amount:</p>
                          <span>
                            {order && order.totalPrice && order.totalPrice}
                          </span>
                        </div>
                      </div>

                      <Typography>Order Status</Typography>
                      <div className="orderDetailsContainerBox">
                        <div>
                          <p
                            className={
                              order &&
                              order.orderStatus &&
                              order.orderStatus === "delivered"
                                ? "greenColor"
                                : "redColor"
                            }
                          >
                            {order && order.orderStatus && order.orderStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="confirmCartItems">
                      <Typography>Your Cart Items:</Typography>
                      <div className="confirmCartItemsContainer">
                        {order &&
                          order.orderItems &&
                          order.orderItems.map((item) => (
                            <div key={item.product}>
                              <img src={item.image} alt="Product" />
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>{" "}
                              <span>
                                {item.quantity} X ₹{item.price} ={" "}
                                <b>${item.price * item.quantity}</b>
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  {/*  */}
                  <div
                    style={{
                      display:
                        order && order.orderStatus === "delivered"
                          ? "none"
                          : "block",
                    }}
                  >
                    <form
                      className="updateOrderForm"
                      onSubmit={updateOrderSubmitHandler}
                    >
                      <h1>Process Order</h1>

                      <div>
                        <AccountTreeIcon />
                        <select
                          onChange={(e) => setOrderStatus(e.target.value)}
                        >
                          <option value="">Choose Category</option>
                          {order && order.orderStatus === "processing" && (
                            <option value="shipped">Shipped</option>
                          )}

                          {order && order.orderStatus === "shipped" && (
                            <option value="delivered">Delivered</option>
                          )}
                        </select>
                      </div>

                      <Button
                        id="createProductBtn"
                        type="submit"
                        disabled={
                          loading
                            ? true
                            : false || orderStatus === ""
                            ? true
                            : false
                        }
                      >
                        Process
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProcessOrder;
