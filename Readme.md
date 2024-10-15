# CryptoView

## Crypto Trading Platform

This is a simple MERN stack application that displays current prices of cryptocurrencies and allows users to trade them.

**Features:**

- **Real-time Cryptocurrency Prices:** Retrieves and displays the latest prices from a trusted cryptocurrency API.
- **Trading Functionality:** Allows users to buy and sell cryptocurrencies.
- **Secure Authentication:** Uses JWT authentication to protect user accounts.
- **User Dashboard:** Displays trading history, portfolio, and other relevant information.

**Getting Started:**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/labs-web3/CryptoView.git
   ```

2. **Install Dependencies:**

   ```bash
   cd CryptoView
   npm install
   ```

3. **Set up Environment Variables:**

   - Create a `.env` file at the root of the project.
   - Add the following environment variables:
     ```
     SECRET=cryptoviewsecret
     MONG_URI=mongodb+srv://salceanu:f34mqJgy29B61Mm7@labsdatabase.5913czx.mongodb.net/?retryWrites=true&w=majority&appName=labsdatabase
     PORT=5000
     VITE_X_CG_DEMO_API_KEY=CG-1t8kdBZJMA1YUmpjF5nypF6R
     ```

4. **Start the Server:**

   ```bash
   npm start
   ```

5. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`.

**Project Structure:**

```
crypto-trading-platform/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── App.js
│   └── index.js
├── public/
└── server/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── server.js
```

**Technologies Used:**

- **Frontend:** React, Redux, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, JWT
- **API:** [Cryptocurrency API](https://example.com/api)

**Contributing:**

Contributions are welcome! Please create a pull request with your changes.

**License:**

This project is licensed under the MIT License.
