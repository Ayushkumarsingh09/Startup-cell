import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
import { ImCross } from "react-icons/im";
import { GiHamburgerMenu } from "react-icons/gi";
import { useContext, useState } from "react";
import AdminContext from "../../../context/AdminContext";

const SidebarAdmin = ({ isSuperAdmin }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [superadmin, setSuperadmin] = useState(isSuperAdmin);
  const { users } = useContext(AdminContext);

  const handleMenu = () => {
    setMenu(!menu);
  };
  const handleClient = () => {
    navigate("/dashboard");
  };

  const links = document.querySelectorAll(".sidebar-admin-links a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      setMenu(false);
    });
  });

  return (
    <div className="">
      <div className={`sidebar-admin ${!menu ? "" : "active"}`}>
        <div className="logo">
          <img
            src="https://res.cloudinary.com/dp92qug2f/image/upload/v1678341163/Ecell%20website/ecell-logo-bw2_sayvqp.webp"
            alt="e-cell logo"
          />
        </div>
        <div className="sidebar-admin-links">
          <NavLink to="/admin/messages">Messages</NavLink>
          <NavLink to="/admin/events">Events</NavLink>
          <NavLink to="/admin/add-events">Add Events</NavLink>
          <NavLink to="/admin/blogs">Blogs</NavLink>
          <NavLink to="/admin/applications-tech">Tech Submissions</NavLink>
          <NavLink to="/admin/applications">Applications</NavLink>
          {superadmin && users && <NavLink to="/admin/users">Users</NavLink>}
        </div>
        <button onClick={handleClient}>Client Site</button>
        <div className="menu"></div>
      </div>
      <div className="menu" onClick={handleMenu}>
        {menu ? <ImCross size={20} /> : <GiHamburgerMenu size={20} />}
      </div>
    </div>
  );
};

export default SidebarAdmin;
