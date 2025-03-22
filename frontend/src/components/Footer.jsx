import React from "react";
import "./css/Header.css";
const Header = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>© 2023 I-Tus Rental Management, Nairobi Kenya</p>
      </div>
      <div className="footer-center">
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
      </div>
      <div className="footer-right">
        <a href="#">Support & Resources</a>
      </div>
    </footer>
  );
};

export default Header;
