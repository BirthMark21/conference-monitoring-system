import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from '../Components/Navbar';

const Reviewadd = () => {
  const [formData, setFormData] = useState({
    
    comments: "",
    rating: "",
    reviewed_at: "",
    feedback: "",
    clarity_and_coherence: "",
    relevance:"",
    originality_and_innovation: "",
    methodology: "",
    results: "",
    significance: "",
    conclusions: "",
    accuracy_and_validity: "",
    conciseness: "",
    language_and_style: "",
    abstract: "",
    reviewer: ""
    // photo: null, // New state for storing the uploaded photo
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Check if the input is a file input
    const newValue = name === "photo" ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    // Include code to send formData to the server
    try {
      // Make a POST request to your Django API endpoint
      await axios.post(
        "http://127.0.0.1:8000/abstract/reviews/",
        formData
      );
      console.log("Data saved successfully!");

      // Redirect to the desired page
      navigate("/exhibitor");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  return (
    <div className="container fade-in">
      <Nav/>
      <div className="row">
        <div className="col-lg-8 offset-lg-2 mt-5 ">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="card-title text-center">review</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                  <label htmlFor="name" className="form-label">
                  comments
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                  rating
                  </label>
                  <textarea
                    className="form-control"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                  reviewed_at
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="reviewed_at"
                    name="reviewed_at"
                    value={formData.reviewed_at}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="website" className="form-label">
                  feedback
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  clarity_and_coherence
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="clarity_and_coherence"
                    name="clarity_and_coherence"
                    value={formData.clarity_and_coherence}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  relevance
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="relevance"
                    name="relevance"
                    value={formData.relevance}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  originality_and_innovation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="originality_and_innovation"
                    name="originality_and_innovation"
                    value={formData.originality_and_innovation}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  methodology
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="methodology"
                    name="methodology"
                    value={formData.methodology}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  results
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="results"
                    name="results"
                    value={formData. results}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  significance
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="significance"
                    name="significance"
                    value={formData. significance}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  conclusions
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="conclusions"
                    name="conclusions"
                    value={formData. conclusions}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  accuracy_and_validity
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="accuracy_and_validity"
                    name="accuracy_and_validity"
                    value={formData. accuracy_and_validity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  conciseness
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="conciseness"
                    name="conciseness"
                    value={formData. conciseness}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  language_and_style
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="language_and_style"
                    name="language_and_style"
                    value={formData. language_and_style}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  abstract
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="abstract"
                    name="abstract"
                    value={formData. abstract}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="socialMediaLink" className="form-label">
                  reviewer
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="reviewer"
                    name="reviewer"
                    value={formData. reviewer}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* <div className="mb-3">
                  <label htmlFor="photo" className="form-label">
                    Photo
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    required
                  />
                </div> */}
                <button type="submit" className="btn btn-primary w-25">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviewadd;
