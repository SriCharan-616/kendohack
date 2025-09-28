import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages/components (capitalized)
import Homepage from './pages/homepage';
import EraSelect from './pages/era_select';
import CharacterSelectPage from './pages/character_select';
import CharacterProfile from "./pages/character_profile";
import GamePage from "./pages/game";
import PlayerBooksPage from "./pages/player_books";
import StorySummary from './pages/story_summary';
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
        <Route path="/game/:characterName" element={<GamePage/>}/>
        <Route path="/player-books" element={<PlayerBooksPage />} />
        <Route path="/story-summary" element={<StorySummary/>}/>

      </Routes>
    </Router>
  );
};

export default AppRoutes;
