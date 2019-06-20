import React, {useState, useEffect} from 'react';

const getData = async word => {
  const response = await fetch(`/.netlify/functions/index?query=${word}`);

  const data = await response.json();

  return data;
};

const getComputerMove = async word => {
  const response = await fetch(
    `/.netlify/functions/index?query=${word}&computerTurn=true`,
  );
  return response.json();
};

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [resultCount, setResultCount] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('loading');

  // When data updates, set loading to false, update the result count, and set the text box to empty
  useEffect(
    () => {
      if (currentPlayer === 'loading' || currentPlayer === 'playerSubmitting') {
        getData(result).then(data => {
          if (data) {
            setResultCount(data.length);

            if (currentPlayer === 'loading') {
              setLoading(false);
              setCurrentPlayer('playerStart');
            } else {
              setCurrentPlayer('playerEnd');
              setInputValue('');
            }
          }
        });
      }
    },
    [result, currentPlayer],
  );

  // Tells the server to start calculating the computers move if it is the computers turn.
  // Posts the computer result to the result state, allows the player to continue playing.
  useEffect(
    () => {
      if (currentPlayer === 'computerStart') {
        setCurrentPlayer('computerSubmitting');

        getComputerMove(result).then(({guess, body}) => {
          const results = JSON.parse(body);
          setResultCount(results.length);
          setResult(result + guess);
          setCurrentPlayer('computerEnd');
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
    setCurrentPlayer('playerSubmitting');
  };

  const handleEndTurn = () => {
    if (currentPlayer === 'playerEnd') setCurrentPlayer('computerStart');
    if (currentPlayer === 'computerEnd') setCurrentPlayer('playerStart');
  };

  // Show loading if we are loding.
  if (loading) return <div>Loading</div>;

  return (
    <div className="App">
      <h1>Guess: {result.toUpperCase()}</h1>
      <p>Possible Guesses: {resultCount}</p>

      {currentPlayer === 'playerStart' && (
        <input
          autoFocus
          type="text"
          onChange={handleChange}
          value={inputValue}
        />
      )}

      {currentPlayer === 'playerSubmitting' && <div>Saving Guess</div>}

      {currentPlayer === 'playerEnd' && (
        <button onClick={handleEndTurn} autoFocus>
          Computer's Turn
        </button>
      )}

      {(currentPlayer === 'computerStart' ||
        currentPlayer === 'computerSubmitting') && <p>Computer Thinking</p>}

      {currentPlayer === 'computerEnd' && (
        <button onClick={handleEndTurn} autoFocus>
          Player's Turn
        </button>
      )}
    </div>
  );
};

export default App;
