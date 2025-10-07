import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AccountDetails from './pages/AccountDetails';
import AddTransaction from './pages/AddTransaction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/account/:id" element={<AccountDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
