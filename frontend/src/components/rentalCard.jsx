import { useState } from "react";
import { Link } from "react-router-dom";

const RentalCard = ({ rental }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === rental.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? rental.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className="property-card"
      key={rental._id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="property-image" style={{ position: "relative" }}>
        <img
          src={
            rental.images && rental.images.length > 0
              ? rental.images[currentImageIndex]
              : "/placeholder.svg"
          }
          alt={rental.rentalName}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />

        {/* Show arrows only when hovered */}
        {isHovered && rental.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
            >
              &#8249;
            </button>
            <button
              onClick={nextImage}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {/* Property details below */}
      <div className="property-details">
        <h3 className="property-title">{rental.rentalName}</h3>
        <p className="property-address">{rental.address}</p>
        <div className="property-specs">
          <p className="property-units">Total Rooms: {rental.totalRooms}</p>
          <p className="property-beds">Available: {rental.availableRooms}</p>
        </div>
        <div className="property-footer">
          <span className="property-price">
            Facilities: {rental.facilities.join(", ")}
          </span>
        </div>
        <Link to={`/rental/${rental._id}`} className="view-property-btn">
          View Property
        </Link>
      </div>
    </div>
  );
};

export default RentalCard;
