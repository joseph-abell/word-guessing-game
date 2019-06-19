import React, {useState, useEffect, useRef} from 'react';

const getData = async word => {
  const response = await fetch(`/.netlify/functions/index?query=${word}`);

  const data = await response.json();

  return data;
};

const getComputerMove = async word => {
  const response = await fetch(
    `/.netlify/functions/index?query=${word}&computerTurn=true`,
  );

  return response.text();
};

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [resultCount, setResultCount] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('player');

  const inputEl = useRef(null);

  // When data updates, set loading to false, update the result count, and set the text box to empty
  useEffect(
    () => {
      getData(result).then(data => {
        if (data) {
          setResultCount(data.length);
          setLoading(false);
          setInputValue('');
        }
      });
    },
    [result],
  );

  // Tells the server to start calculating the computers move if it is the computers turn.
  // Posts the computer result to the result state, allows the player to continue playing.
  useEffect(
    () => {
      if (currentPlayer === 'computer') {
        setCurrentPlayer('');
        getComputerMove(result).then(guess => {
          setResult(result + guess);
          setCurrentPlayer('player');
          inputEl && inputEl.current && inputEl.current.focus();
        });
      }
    },
    [currentPlayer, result],
  );

  // If we make a change to the input box, it will update the value inside the input box,
  // create an aggregated result, and change the player to the computer.
  const handleChange = async event => {
    setInputValue(event.target.value);
    setResult(result + event.target.value);
    setCurrentPlayer('computer');
  };

  // Show loading if we are loding.
  if (loading) return <div>Loading</div>;

  return (
    <div className="App">
      <h1>Guess: {result.toUpperCase()}</h1>
      <p>Possible Guesses: {resultCount}</p>

      <input
        ref={inputEl}
        autoFocus
        type="text"
        onChange={handleChange}
        value={inputValue}
        disabled={currentPlayer !== 'player'}
      />
    </div>
  );
};

export default App;
