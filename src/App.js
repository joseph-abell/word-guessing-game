import React, {useState} from 'react';

const App = () => {
  const [word, setWord] = useState('');
  const [play, setPlay] = useState(true);

  const handleChange = async event => {
    setWord(event.target.value);
    setPlay(false);
    const response = await fetch('./netlify/functions/index');
    const data = await response.text();
    console.log(data);
  };

  return (
    <div className="App">
      <h1>{word.toUpperCase()}</h1>
      <input
        type="text"
        onChange={handleChange}
        value={word}
        disabled={!play}
      />
    </div>
  );
};

export default App;
