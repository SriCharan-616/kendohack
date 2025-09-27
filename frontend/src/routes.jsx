import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages/components (capitalized)
import Homepage from './pages/homepage';
import EraSelect from './pages/era_select';
import CharacterSelectPage from './pages/character_select';
import CharacterProfile from "./pages/character_profile";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Era selection page */}
        <Route path="/era-select" element={<EraSelect />} />
        {/* Character selection page */}
        <Route path="/characters/:eraSlug" element={<CharacterSelectPage />} />
         <Route path="/play/:characterName" element={<CharacterProfile />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
