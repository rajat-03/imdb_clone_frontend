import { NavLink, Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="bg-black text-white">
          <nav className="flex items-center justify-between px-6 py-4">
            <NavLink to={"/"} className="flex items-center">
              <img src="/imdb.png" alt="imdb_icon" className="w-12" />
            </NavLink>

            <ul className="flex space-x-6 text-lg">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "bg-yellow-500 hover:underline px-2 py-1 rounded-md" : "hover:underline"
                  }
                >
                  Movies
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/actors"
                  className={({ isActive }) =>
                    isActive ? "bg-yellow-500 hover:underline px-2 py-1 rounded-md" : "hover:underline"
                  }
                >
                  Actors
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/producers"
                  className={({ isActive }) =>
                    isActive ? "bg-yellow-500 hover:underline px-2 py-1 rounded-md" : "hover:underline"
                  }
                >
                  Producers
                </NavLink>
              </li>
            </ul>
            <div></div>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
