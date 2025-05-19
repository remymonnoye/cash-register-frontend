import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/navbar";
import Boissons from "./components/boissons";
import AddDrink from "./components/adddrinks";


function App() {
  return (
    
      <Box>
        <Navbar />
      <Routes>
        <Route path="/" element={<Boissons />} />
        <Route path="/adddrinks" element={<AddDrink />} />
      </Routes>
    </Box>
  );
}

export default App;