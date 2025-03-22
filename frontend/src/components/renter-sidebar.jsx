import { Home, Plus, ClipboardList, Settings, MessageSquare, LogOut } from "lucide-react"
import "./css/renter-sidebar.css"

const OwnerSidebar = ({ activeItem }) => {
  const menuItems = [
    {
      id: "discover",
      icon: <Home size={24} />,
      label: "Discover",
    },
    {
      id: "apply-hostel",
      icon: <Home size={24} />,
      label: "Apply Hostel",
    },
    {
      id: "apply-rooms",
      icon: <Plus size={24} />,
      label: "Apply Rooms",
    },
    {
      id: "request-parking",
      icon: <ClipboardList size={24} />,
      label: "Request Parking",
    },
    {
      id: "add-ratings",
      icon: <Settings size={24} />,
      label: "Add Ratings",
    },
    {
      id: "messages",
      icon: <MessageSquare size={24} />,
      label: "Messages",
    },
    {
      id: "logout",
      icon: <LogOut size={24} />,
      label: "Logout",
    },
  ]

  return (
    <div className="owner-sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className={`sidebar-item ${activeItem === item.id ? "active" : ""}`}>
              <a href={`#${item.id}`} className="sidebar-link">
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default OwnerSidebar

