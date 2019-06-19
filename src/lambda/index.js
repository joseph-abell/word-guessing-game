const https = require('https');

export function handler(event, context, callback) {
  const data = [];
  const word = (event.queryStringParameters.query || '').toLowerCase();
  const computerTurn = !!event.queryStringParameters.computerTurn;
  console.log(computerTurn, word);
  https.get('https://word-guess.netlify.com/words.json', res => {
    res.setEncoding('utf8');

    res.on('data', d => {
      data.push(d);
    });

    res.on('end', () => {
      const body = JSON.stringify(
        JSON.parse(data.join('')).filter(w => w.startsWith(word)),
      );

      if (computerTurn) {
        callback(null, {
          statusCode: 200,
          body: 'a',
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
