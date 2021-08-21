const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cors());
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./db/dictionary.json');
const db = low(adapter);

// api test the connection between client and server
app.get('/', (req, res) => {
  const message = "Welcome to API Translate Eng to Vn :))";
  res.json({ message });
});

// api get all word in dictionary
app.get('/words', (req, res) => {
  const ret = db.get('words');
  res.json(ret);
});

//api translate from Eng to VN (data from params of request). vd: localhost:4200/translate/hello
app.get('/translate/:EngWord', async (req, res) => {
  try {
    const EngWord = req.params.EngWord;
    const wordInDictionary = await db.get('words').find({ en: `${EngWord}` }).value();
    if (!wordInDictionary) {
      return res.status(403).json({ success: false, message: "This word does not exist in Dictionary!!!" });
    };
    res.json({
      success: true,
      en: wordInDictionary.en,
      vn: wordInDictionary.vn
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

// api add new word into dictionary (data from body of request). vd {"vn": "xin chào", "en": "hello"}
app.post('/add-word', async (req, res) => {
  try {
    const newWord = req.body;
    const isExist = db.get('words').find({ en: `${newWord.en}` }).value();
    if (isExist) return res.status(409).json({ success: false, message: 'This word is already exist in DB!!!' });
    await db.get('words')
      .push(newWord)
      .write();
    res.json({
      success: true,
      ...newWord
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

// api delete a word from dictionary (data from body of request). vd {"en": "Hello"}
app.delete('', async (req, res) => {
  try {
    let en_word = req.body.en;
    if (!en_word || en_word.length == 0) {
      return res.status(403).json({
        success: false,
        message: 'request body is empty !!!'
      });
    };
    const isExist = await db.get('words').find({ en: `${en_word}` }).value();
    if (!isExist) {
      return res.status(404).json({ success: false, message: `"${en_word}" is already not exist in DB!!!` });
    } else {
      await db.get('words').remove({ en: `${en_word}` }).write();
      res.json({
        success: true,
        message: `*${en_word}* is already deleted`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

//api update từ vựng trong dictionary. Data lấy từ req body. 
//VD: {"vn": "xìn cháo", "edit_into": "xin chào"} or {"en": "heloo", "edit_into": "hello" }
app.put('', async (req, res) => {
  try {
    let vn_word = req.body.vn;
    console.log('req.body', req.body)
    console.log('vn_word', vn_word);
    let en_word = req.body.en;
    let edit_into = req.body.edit_into;

    if (!edit_into || edit_into.length == 0 || (vn_word && en_word) ||
      ((!vn_word || vn_word.length == 0) && (!en_word || en_word.length == 0))) {
      return res.status(403).json({
        success: false,
        message: 'request body is invalid !!!'
      });
    };

    let isExist
    if (vn_word) {
      isExist = await db.get('words').find({ vn: `${vn_word}` }).value();
    } else {
      isExist = await db.get('words').find({ en: `${en_word}` }).value();
    }

    if (!isExist) {
      if (vn_word) {
        return res.status(404).json({ success: false, message: `*${vn_word}* is not exist in DB!!!` });

      } else {
        return res.status(404).json({ success: false, message: `"*${en_word}* is not exist in DB!!!` });

      }
    } else {
      if (vn_word) {
        await db.get('words').find({ vn: `${vn_word}` }).assign({ vn: `${edit_into}` }).write();
        return res.json({
          success: true,
          message: `*${vn_word}* is already edited into *${edit_into}* in DB`
        });
      } else {
        await db.get('words').find({ en: `${en_word}` }).assign({ en: `${edit_into}` }).write();
        return res.json({
          success: true,
          message: `*${en_word}* is already edited into *${edit_into}* in DB`
        });
      }

    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

const PORT = 4200;
app.listen(PORT, () => {
  console.log('App is running in port ', PORT);
})