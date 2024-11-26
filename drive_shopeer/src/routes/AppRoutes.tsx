import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "../page/HomePage";
import Viagens from "../page/Viagens";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ride/:id" element={<Viagens />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
