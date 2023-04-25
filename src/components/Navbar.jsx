import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { supabase } from "./client";
import "../App.css";

const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const { collapseSidebar } = useProSidebar(false);

  useEffect(() => {
    const getUserData = async () => {
      const data = await supabase.auth.getUser();
      const user = data.data.user.id
      if (user == null) {
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
    };
    getUserData();
  }, []);
  const handleLogOut = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
  };

  return (
    <div
      id="sidebar"
      style={({ height: "100vh" }, { display: "inline-block" })}
    >
      <Sidebar style={{ height: "100vh" }}>
        <Menu>
          <MenuItem
            icon={<MenuOutlinedIcon />}
            onClick={() => {
              collapseSidebar();
            }}
            style={{ textAlign: "center" }}
          >
            <h2>Recipe</h2>
          </MenuItem>

          <Link to="/">
            <MenuItem icon={<HomeOutlinedIcon />}>Home</MenuItem>
          </Link>
          <Link to="/favorites">
            <MenuItem icon={<ContactsOutlinedIcon />}>Favorites</MenuItem>
          </Link>
          {console.log(authenticated)}
          {authenticated ? (
            <MenuItem icon={<PeopleOutlinedIcon />} onClick={handleLogOut}>
              Log Out
            </MenuItem>
          ) : (
            <Link to="/login">
              <MenuItem icon={<PeopleOutlinedIcon />}>Log In</MenuItem>
            </Link>
          )}
        </Menu>
      </Sidebar>
    </div>
  );
}

export default Navbar;
