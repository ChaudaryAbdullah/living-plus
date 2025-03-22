import React from "react";
import "./css/footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="copyright">
        © 2023 I-Tus Rental Management, Nairobi Kenya
      </div>
      <div className="footer-links">
        <a href="#" className="footer-link">
          Terms
        </a>
        <a href="#" className="footer-link">
          Privacy
        </a>
        <a href="#" className="footer-link">
          Support & Resources
        </a>
      </div>
    </footer>
  );
};

export default Footer;
