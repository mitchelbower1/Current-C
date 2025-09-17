import { useEffect, useState } from "react";
import { CgSwapVertical } from "react-icons/cg";
import { US, GB, EU, IN, CA, AU, JP, NG } from "country-flag-icons/react/1x1";

import "./App.css";

function App() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [converted, setConverted] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function convert() {
        setIsLoading(true);
        setError("");
        try {
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
          );

          if (!res.ok) throw Error("Error fetching converted currency");
          const data = await res.json();
          setConverted(data.rates[toCurrency]);
        } catch (err) {
          setError(err.message);
          setConverted("");
        } finally {
          setIsLoading(false);
        }
      }

      if (fromCurrency === toCurrency) {
        setConverted(amount);
        setError("");
        return;
      }

      convert();
    },
    [amount, fromCurrency, toCurrency]
  );

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="main">
      <Header />
      <div className="conversion-form">
        <input
          className="currency-input"
          type="text"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
          <option value="CAD">CAD C$</option>
          <option value="INR">INR ₹</option>
          <option value="AUD">AUD AU$</option>
          <option value="JPY">JPY ¥</option>
        </select>

        <button className="swap-button" onClick={handleSwap}>
          <CgSwapVertical />
        </button>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          <option value="USD">USD $</option>
          <option value="EUR">EUR €</option>
          <option value="CAD">CAD C$</option>
          <option value="INR">INR ₹</option>
          <option value="AUD">AUD AU$</option>
          <option value="JPY">JPY ¥</option>
        </select>
        {error && <ErrorMessage message={error} />}
        {isLoading && <p className="loading">Converting...</p>}
        {!error && !isLoading && converted && (
          <p className="converted-amount">
            {converted} {toCurrency}
          </p>
        )}
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <header className="header">
      <h1>Current-C</h1>
      <ul>
        <li>
          <US className="flag-icon" />
        </li>
        <li>
          <EU className="flag-icon" />
        </li>
        <li>
          <IN className="flag-icon" />
        </li>
        <li>
          <AU className="flag-icon" />
        </li>
        <li>
          <CA className="flag-icon" />
        </li>
        <li>
          <JP className="flag-icon" />
        </li>
      </ul>
    </header>
  );
};

const ErrorMessage = ({ message }) => {
  return (
    <p className="error">
      <span>❗</span> {message}
    </p>
  );
};

export default App;
