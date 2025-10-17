import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AccountDetails from './pages/AccountDetails';
import AddTransaction from './pages/AddTransaction';
import AccountsHome from './pages/AccountsHome';
import { AuthProvider } from './Context/AuthContext';
import AddAccount from './pages/AddAccount';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/account/:id" element={<AccountDetails />} />
          <Route path="/accounts" element={<AccountsHome />} />
          <Route path="/add-account" element={<AddAccount />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
