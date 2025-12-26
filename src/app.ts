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
  const sentence = await getRandomSentence();

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
  const analyzis = await analyzeSentence(req.params.sentence);

  const analyzisCore = analyzis.data.output.component.analysis;
  const analyzisTree = analyzis.data.output.component.tree;

  console.log(analyzisTree.children)

  res.render('analyzis', {
    layout: false,
    analyzis: {
      structure: analyzisCore.structure,
      wordOrder: analyzisCore.wordOrder,
      caseUsage: analyzisCore.caseUsage,
      explanation: analyzisCore.pragmatics.explanation,
      tree: analyzisTree.children
        .filter(c => c.component !== 'Interpunktion')
        .map(c => {
          if (c.word === c.children?.[0]?.word) { // flatten
            return {
              word: c.word,
              detail: [
                {
                  type: c.component,
                  description: c.description
                },
                {
                  type: c.children[0].component,
                  description: c.children[0].description
                }
              ]
            }
          }
          return { // remap
            ...treeComponentMapper(c),
            children: c.children?.map(treeComponentMapper)
          }
        })
    }
  });
});

function treeComponentMapper(component) {
  return {
    word: component.word,
    detail: [
      {
        type: component.component,
        description: component.description
      }
    ]
  };
}

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});