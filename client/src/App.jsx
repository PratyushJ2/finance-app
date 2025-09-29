import React, { useState, useEffect } from 'react';

function App() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch('/accounts')
      .then(res => res.json())
      .then(data => setAccounts(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Accounts</h1>
      <ul>
        {accounts.map(account => (
          <li key={account.id}>{account.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
