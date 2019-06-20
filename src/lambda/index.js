const https = require('https');

export function handler(event, context, callback) {
  const data = [];
  const word = (event.queryStringParameters.query || '').toLowerCase();
  const computerTurn = !!event.queryStringParameters.computerTurn;

  https.get('https://word-guess.netlify.com/words.json', res => {
    res.setEncoding('utf8');

    res.on('data', d => {
      data.push(d);
    });

    res.on('end', () => {
      let guess = word;

      if (computerTurn) {
        guess = guess + 'a';
      }

      const body = JSON.stringify(
        JSON.parse(data.join('')).filter(w => w.startsWith(guess)),
      );

      if (computerTurn) {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            guess: 'a',
            body,
          }),
        });
      } else {
        callback(null, {
          statusCode: 200,
          body,
        });
      }
    });
  });
}
