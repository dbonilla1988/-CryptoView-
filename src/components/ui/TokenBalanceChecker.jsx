import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './button.jsx';  // Using the default export
import { Input } from './input'; // Assuming this is a named export

const TokenBalanceChecker = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]); // State for transactions
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Function to fetch balance
  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/token-balance?walletAddress=${walletAddress}`);
      setBalance(response.data.balance);
      await fetchTransactions(walletAddress); // Fetch transactions after getting balance
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError('Error retrieving balance. Please check the wallet address.');
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch transactions
  const fetchTransactions = async (address) => {
    try {
      const response = await fetch('/api/transactions/track', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_GENERATED_JWT_TOKEN', // Replace with your actual JWT
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        alert(`Error: ${errorMessage.error}`);
        setError(errorMessage.error);
        return;
      }

      const data = await response.json();
      console.log(data); // Log the data for debugging
      setTransactions(data); // Store the transactions in state
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch transactions");
    }
  };

  return (
    <div>
      <h1>Check Token Balance</h1>
      <Input 
        type="text" 
        value={walletAddress} 
        onChange={(e) => setWalletAddress(e.target.value)} 
        placeholder="Enter Wallet Address"
      />
      <Button onClick={fetchBalance} disabled={loading}>
        {loading ? 'Checking...' : 'Check Balance'}
      </Button>
      {balance && <p>Balance: {balance}</p>}
      {error && <p>{error}</p>}
      
      {/* Displaying fetched transactions */}
      {transactions.length > 0 && (
        <div>
          <h2>Recent Transactions</h2>
          <ul>
            {transactions.map((tx) => (
              <li key={tx.hash}>
                <p>From: {tx.from}</p>
                <p>To: {tx.to}</p>
                <p>Value: {tx.value}</p>
                <p>Hash: {tx.hash}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TokenBalanceChecker;