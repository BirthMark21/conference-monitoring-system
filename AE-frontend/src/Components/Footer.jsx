import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const hideFooterPaths = ["/room"];

  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  const currentyear = new Date().getFullYear();

  return (
    !shouldHideFooter && (
      <footer className="py-3 my-4 bg-dark">
        <ul className="nav justify-content-center border-bottom pb-3 mb-3">
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-muted">
              FAQs
            </a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-link px-2 text-muted">
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link px-2 text-muted">
              Contact
            </a>
          </li>            
        </ul>
        <p className="text-center text-muted">
          © {currentyear} Event Pulse, Inc
        </p>
      </footer>
    )
  );
};

export default Footer;
