import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import IMDBIcon from "../assets/imdb_icon.png";
import Footer from "./Footer";

function Dashboard() {
  const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const checkToken = () => {
//     if (!localStorage.getItem("token")) {
//       navigate("/login", { replace: true });
//     }
//   };

//   useEffect(() => {
//     checkToken();
//   }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="bg-black text-white">
          <nav className="flex items-center justify-between px-6 py-4">
            <NavLink to={"/"} className="flex items-center">
              {/* <img src={IMDBIcon} alt="imdb_icon" className="w-12" /> */}
            </NavLink>
            <button
              className="md:hidden text-white focus:outline-none"
              type="button"
              aria-label="Toggle navigation"
            >
              <span className="block w-6 h-0.5 bg-white mb-1"></span>
              <span className="block w-6 h-0.5 bg-white mb-1"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </button>
            <ul className="hidden md:flex space-x-6 text-lg">
              <li>
                <NavLink to="/" className="hover:underline">
                  Movies
                </NavLink>
              </li>
              <li>
                <NavLink to="/actors" className="hover:underline">
                  Actors
                </NavLink>
              </li>
              <li>
                <NavLink to="/producers" className="hover:underline">
                  Producers
                </NavLink>
              </li>
              <li>
                <button
                //   onClick={handleLogout}
                  className="hover:underline text-red-500"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-grow">
          <Outlet />
        </div>
        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default Dashboard;
