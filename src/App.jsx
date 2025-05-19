import {Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/navbar";
import Boissons from "./components/boissons";


function App() {
  return (
    
      <Box>
        <Navbar />
      <Routes>
        <Route path="/" element={<Boissons />} />
      </Routes>
    </Box>
  );
}

export default App;