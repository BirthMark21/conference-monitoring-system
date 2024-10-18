import React from "react";
import { Link } from "react-router-dom";

const SearchBar = () => {
  return (
    <div className="container mt-5 mb-5 ">
      <div className="search-bar d-flex justify-content-end">
        <div className="search-field me-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
          ></input>
        </div>
        <div className="add-btn">
          <Link to={"/eventreg"} className="btn btn-primary">
            + Add Event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
