import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages/components (capitalized)
import Homepage from './pages/homepage';
import EraSelect from './pages/era_select';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Era selection page */}
        <Route path="/era-select" element={<EraSelect />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
