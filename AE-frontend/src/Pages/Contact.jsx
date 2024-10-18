import React from "react";

const Contact = () => {
  return (
    <section id="contact">
      <div className="container">
        <div className="row mt-2">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Contact Us</h2>
                <form>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Our Location</h2>
                <p>
                  <strong>Address:</strong> Kebele 14 Adama, Ethiopia
                </p>
                <p>
                  <strong>Phone:</strong> +251-221-110400
                </p>
                <p>
                  <strong>Fax:</strong> +251-221-100038
                </p>
                <p>
                  <strong>Email:</strong> info@astu.edu.et
                </p>
                <p>
                  <strong>Postal Code:</strong> 1888 Adama, Ethiopia
                </p>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25050.91932207028!2d39.28331547425739!3d8.569773944566581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b1fe4c294e6cb%3A0x6b86d6a89f24215c!2sAdama%20Science%20And%20Technology%20University%20%2CASTU%2C%20Adama%20%2CEthiopia!5e0!3m2!1sen!2set!4v1693219502504!5m2!1sen!2set"
                  width="600"
                  height="450"
                  style={{ border: 0, width: "100%", height: "200px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
