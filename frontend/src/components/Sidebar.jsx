import { useNavigate } from "react-router-dom";
import {
  Home,
  MessageCircle,
  PlusSquare,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react"; // Added LayoutDashboard icon
import "./css/sidebar.css";

const Sidebar = ({ onLogout, activeItem, setActiveItem }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "discover",
      path: "/rental-view",
      icon: <Home size={24} />,
      label: "Discover",
    },
    {
      id: "dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={24} />, // Dashboard icon
      label: "Dashboard",
    },
    {
      id: "messages",
      path: "/messages",
      icon: <MessageCircle size={24} />,
      label: "Messages",
    },
    {
      id: "register-rental",
      path: "/register-hostel",
      icon: <PlusSquare size={24} />,
      label: "Register Rental",
    },
    {
      id: "apply-rental",
      path: "/apply-rental",
      icon: <Settings size={24} />,
      label: "Apply Rental",
    },
    {
      id: "LogOut",
      path: "/",
      icon: <LogOut size={24} />,
      label: "Logout",
    },
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`sidebar-item ${
                activeItem === item.id ? "active" : ""
              }`}
            >
              <a
                href={item.path}
                className="sidebar-link"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="sidebar-icon">{item.icon}</div>
                <span className="sidebar-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
