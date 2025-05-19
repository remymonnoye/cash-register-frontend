import { Routes, Route } from "react-router-dom";

import Boissons from "./components/boissons";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Boissons />} />
    </Routes>
  );
}

export default App;