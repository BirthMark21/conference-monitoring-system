import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./ReviewerReport.css";

const ReviewerReport = () => {
  const [reviewers, setReviewers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviewers/");
      if (response.ok) {
        const data = await response.json();
        setReviewers(data);
      } else {
        console.error("Error fetching reviewers:", response.status);
      }
    } catch (error) {
      console.error("Error fetching reviewers:", error);
    }
  };

  const handleDownloadReport = () => {
    window.location.href = "http://127.0.0.1:8000/generate_report/";
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Reviewer Report</h1>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover className="reviewer-table">
          <thead>
            <tr>
              <th className="table-header">#</th>
              <th className="table-header small-text">Name</th>
              <th className="table-header small-text">Expertise</th>
              <th className="table-header">Rating</th>
              <th className="table-header">Status</th>
              <th className="table-header small-text">Total Reviews Completed</th>
              <th className="table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {reviewers.map((reviewer, index) => (
              <tr key={reviewer.id}>
                <td className="table-data">{index + 1}</td>
                <td className="table-data small-text">{reviewer.name}</td>
                <td className="table-data small-text">{reviewer.expertise}</td>
                <td className="table-data">{reviewer.rating}</td>
                <td className="table-data">{reviewer.status}</td>
                <td className="table-data small-text">{reviewer.total_reviews_completed}</td>
                <td className="table-data">
                  {index === 0 && (
                    <Button onClick={handleDownloadReport} className="action-button">
                      <FaDownload />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ReviewerReport;
