import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages/components (capitalized)
import Homepage from './pages/homepage';
import EraSelect from './pages/era_select';
import CharacterSelect from './pages/character_select';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Era selection page */}
        <Route path="/era-select" element={<EraSelect />} />
        {/* Character selection page */}
        <Route path="/character-select" element={<CharacterSelect />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
