import express, { urlencoded } from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { getRandomSentence } from './services/tatoebaConnector';
import { analyzeSentence } from './services/satzklarConnector';
import { text } from 'stream/consumers';
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
  //const sentence = await getRandomSentence();
  const sentence = {
    text: 'Ich habe einen Hund',
    translations:
      [
        {
          lang: 'eng',
          text: 'I have a dog',
        }
      ],
    audios: [{
      download_url: ""
    }]
  };

  // const html = `
  //   <p>${sentence.text}</p>
  //   <p>${sentence.translations.filter(t => t.lang === 'eng')[0].text}</p>
  //   <audio controls src="${sentence.audios[0].download_url}"></audio>
  //   <p>${analyzisCore.structure}</p>
  //   <p>${analyzisCore.wordOrder}</p>
  //   <p>${analyzisCore.caseUsage}</p>
  //   <p>${analyzisCore.pragmatics.explanation}</p>
  //   ${
  //     analyzisTree.children.map(c => c.word + ' ' + c.description)
  //   }
  // `;
  res.render('home', { 
    sentence: {
      german: sentence.text,
      english: sentence.translations.filter(t => t.lang === 'eng')[0].text,
      audio: sentence.audios[0].download_url,
      urlEncoded: encodeURI(sentence.text)
    }
  });
});

app.get('/analyzis/:sentence', async (req, res) => {
  // const analyzis = await analyzeSentence(req.params.sentence);

  // const analyzisCore = analyzis.data.output.component.analysis;
  // const analyzisTree = analyzis.data.output.component.tree;

  res.render('analyzis', {
    layout: false,
    analyzis: {

    }
  });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});