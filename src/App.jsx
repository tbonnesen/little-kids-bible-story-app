import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import StoryDetail from './pages/StoryDetail';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

// Component to handle route transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/story/:id" element={<StoryDetail />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <ThemeToggle />
        <AnimatedRoutes />
      </div>
    </Router>
  );
};

export default App;
