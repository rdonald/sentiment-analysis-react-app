import React, { useState, useEffect } from 'react';
import './App.css';
import positiveGIF from './images/positiveGIF.gif';
import negativeGIF from './images/negativeGIF.gif';
import neutralGIF from './images/neutralGIF.gif';

import Sentiment from 'sentiment';
const sentiment = new Sentiment();

function App() {

  const [phrase, setPhrase] = useState('');
  const [sentimentScore, setSentimentScore] = useState(null);

  useEffect(() => {
    setSentimentScore(sentiment.analyze(phrase));
  }, [phrase]);

  // Hard Coded stream ID
  var id = "ieUbJ9nLbIo";
  var APIKey = "<API KEY HERE>";

  // Hard Coded chat Id
  // var chatid = getChatId(id, APIKey);
  var chatid = "Cg0KC2llVWJKOW5MYklvKicKGFVDUkFFVUFtVzlrbGV0SXpPeGhwTFJGdxILaWVVYko5bkxiSW8";

  getChatMessages(chatid, APIKey);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Sentiment Analysis</h2>

        <input value={phrase} onChange={e => setPhrase(e.target.value)}
          style={{ padding: '20px', fontSize: '20px', width: '90%' }}
        />

        {
          sentimentScore !== null ?
            <p>Sentiment Score: {sentimentScore.score}</p>
            : ''
        }

        {
          sentimentScore ?
            sentimentScore.score === 0 ?
              <img src={neutralGIF} alt="neutral" />
              :
              sentimentScore.score > 0 ?
                <img src={positiveGIF} alt="postive" />
                :
                <img src={negativeGIF} alt="negative" />
            : ''
        }

      </header>
    </div>
  );
}

async function getChatId(id, APIKey) {
  try {
    var res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&key=${APIKey}&id=${id}`
    );

    var data = await res.json();

    if (!data.error) {
      if (!data.items.length == 0) {
        let livechatid = data.items[0].liveStreamingDetails.activeLiveChatId;
        console.log(livechatid);
      } else {
        console.log('LiveStream not found.');
      }
    }
  } catch {
    console.log('error occured');
  }
}

async function getChatMessages(chatid, APIKey) {
  try {
    var res = await fetch(
      `https://www.googleapis.com/youtube/v3/liveChat/messages?part=id%2C%20snippet&key=${APIKey}&liveChatId=${chatid}`
    );

    var data = await res.json();

    if (!data.error) {
      if (!data.items.length == 0) {
        for (var i = 0; i < data.items.length; i++) {
          console.log(data.items[i].snippet.displayMessage);
        }
        console.log(' -- ' + i + ' messages returned --')
      }
    }
  } catch (error) {
    console.log('error occured');
  }
}

export default App;
