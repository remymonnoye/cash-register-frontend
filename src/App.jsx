import { Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/navbar";
import Boissons from "./components/boissons";
import AddDrink from "./components/adddrinks";
import Login from "./components/login";
import RequireAuth from "./components/RequireAuth";
import "./App.css";

function App() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login";
  return (
      <Box>
        {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Boisson" element={
         <RequireAuth>
          <Boissons />
         </RequireAuth>
        } />
        <Route path="/adddrinks" element={
          <RequireAuth>
            <AddDrink />
          </RequireAuth>
        } />
      </Routes>
    </Box>
  );
}

export default App;