import React from "react";
import { NavLink } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="row text-center">
      <div style={{ marginTop: "30px" }} className="col-8 offset-2">
        <h1 style={{ fontSize: "300px" }} id="error404">
          404
        </h1>
        <h1>WR ARE SORRY, PAGE NOT FOUND</h1>
        <p>
          THE PAGE YOU ARE LOOKING FOR MIGHT HAVE BEEN REMOVED HAD ITS NAME
          CHANGED OR TEMPORARY UNAVAILABLE
        </p>
        <NavLink
          style={{ borderRadius: "20px" }}
          className="text-decoration-nome text-light btn btn-primary"
          to="/"
        >
          BACK TO HOME
        </NavLink>
      </div>
    </div>
  );
};

export default ErrorPage;
