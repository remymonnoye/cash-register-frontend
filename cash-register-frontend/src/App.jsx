import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/ui/navbar";
import Boissons from "./components/drinks/boissons";
import AddDrink from "./components/drinks/adddrinks";
import Login from "./components/auth/login";
import RequireAuth from "./components/auth/RequireAuth";

function App() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login";
  return (
      <Box>
        {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={
          localStorage.getItem("token") 
          ? <Navigate to="/Boisson" replace />
          : <Navigate to="/login" replace />
        } />
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