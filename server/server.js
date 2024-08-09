// src/index.mjs
import express from 'express';
import cors from 'cors';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import multer from 'multer';
import axios from 'axios';
import { Readable } from 'stream';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

//todo Get all records
app.get('/', async (req, res) => {
  try {
    const kintoneClient = new KintoneRestAPIClient({
      baseUrl: 'https://n3naf1x3ct3n.cybozu.com',
      auth: {
        apiToken: 't19RVxAK2wOlNk31iCtOrGaeMnTzf6WUa22dp7Wu',
      },
    });

    const response = await kintoneClient.record.getRecords({
      app: 151, // Replace with your app ID
    });
    // Check if the response has records and they are not empty
    // if (!response.records || response.records.length > 0) {
    //   return res.json({ error: 'No data found' });
    // }

    // console.log('Response from Kintone API:', response.records[0]);


    res.json({ data: response, message: 'Data fetched successfully' });
  } catch (error) {
    console.error('Error fetching Kintone data:', error);

    // Send the error message back to the client for debugging
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

//todo Get 1 record
app.post('/getUser', async (req, res) => {
  try {
    // console.log("req.body", req.body);
    const { userInput, password } = req.body;
    // console.log('userInput', userInput);
    // console.log('password', password);
    let query = `(NAME like "${userInput}" or EMAIL like "${userInput}") and PASSWORD like "${password}"`;
    // console.log('query', query);

    // const { id } = req.body;
    const kintoneClient = new KintoneRestAPIClient({
      baseUrl: 'https://n3naf1x3ct3n.cybozu.com/',
      auth: {
        apiToken: '3e1ABIpI1VjgoopCjrsPppSzuvfE83zB3EQ0g7g3',
      },
    });

    const response = await kintoneClient.record.getRecords({
      app: 148,
      query
    });
    // Check if the response has records and they are not empty
    // if (!response.records || response.records.length > 0) {
    //   return res.json({ error: 'No data found' });
    // }
    // console.log('Response from Kintone API:', response);


    res.json({ data: response, message: 'Data fetched successfully' });
  } catch (error) {
    console.error('Error:', error.errors.query);
    res.status(500).json({ error: error, details: error.message });
  }
});

// add code new 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../src/uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 500000000 } // 500MB limit
}).fields([
  { name: 'files', maxCount: 10 },
  { name: 'image', maxCount: 10 }
]);

// POST route to handle array file upload
app.post('/addLibrary', upload, async (req, res) => {
  try {
    console.log('req.files:', req.files.files);
    console.log('req.image:', req.files.image);
    console.log('req.body:', req.body);

    // const files = req.files.files;
    // const image = req.files.image;
    const files = req.files?.files || [];
    const image = req.files?.image || [];

    const {
      userName,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample,
    } = JSON.parse(req.body.record);

    // console.log('Username:', userName);

    const uploadFileToKintone = async (file) => {
      const filePath = file.path;
      const fileContent = fs.readFileSync(filePath);
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath), {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await axios.post('https://n3naf1x3ct3n.cybozu.com/k/v1/file.json', formData, {
        headers: {
          'X-Cybozu-API-Token': 't19RVxAK2wOlNk31iCtOrGaeMnTzf6WUa22dp7Wu',
          ...formData.getHeaders(),
        },
      });

      return response.data.fileKey;
    };

    let fileKeys = [];
    if (files) {
      for (const file of files) {
        const fileKey = await uploadFileToKintone(file);
        fileKeys.push({ fileKey });
        fs.unlinkSync(file.path);
      }
      // console.log(fileKeys);
    }

    let imageKey = '';
    if (Array.isArray(image) && image.length > 0) {
      const img = image[0];
      if (img.path) {
        // console.log('Processing image:', img);
        imageKey = await uploadFileToKintone(img);
        fs.unlinkSync(img.path);
      } else {
        console.error('Image path is not defined');
      }
    }

    const recordData = {
      app: 151,
      record: {
        CerateBy: { value: userName },
        LIB_NAME: { value: libraryName },
        DESCRIPTION: { value: description },
        REFERENCE: { value: reference },
        DESCRIPTIONS_OVER: { value: overviewDes },
        DESCRIPTIONS_INS: { value: installationDes },
        DESCRIPTIONS_HTU: { value: HowToUseDes },
        DESCRIPTIONS_EXP: { value: exampleDes },
        DESCRIPTIONS_SGT: { value: suggestionDes },
        INSTALLATIONS: {
          value: rowsInstallations.map(item => ({
            value: {
              TITLE_INS: { value: item.title },
              CONTENT_INS: { value: item.description },
              EXAMPLE_INS: { value: item.example },
            }
          }))
        },
        HOWTOUSE: {
          value: rowsHowToUse.map(item => ({
            value: {
              TITLE_HTU: { value: item.title },
              CONTENT_HTU: { value: item.description },
              EXAMPLE_HTU: { value: item.example },
            }
          }))
        },
        EXAMPLE: {
          value: rowsExample.map(item => ({
            value: {
              TITLE_EXP: { value: item.title },
              CONTENT_EXP: { value: item.description },
              EXAMPLE_EXP: { value: item.example },
            }
          }))
        },
        FILE: { value: fileKeys },
        IMAGE: {
          value: imageKey ? [{ fileKey: imageKey }] : []
        }
        // IMAGE: {
        //   value: [
        //     { fileKey: imageKey }
        //   ]
        // }
      }
    };

    // console.log('record:', recordData);

    const recordResponse = await axios.post('https://n3naf1x3ct3n.cybozu.com/k/v1/record.json', recordData, {
      headers: {
        'X-Cybozu-API-Token': 't19RVxAK2wOlNk31iCtOrGaeMnTzf6WUa22dp7Wu',
        'Content-Type': 'application/json',
      },
    });

    // console.log('recordResponse:', recordResponse.data);
    res.json(recordResponse.data);
  } catch (error) {
    // console.error('Error:', error);
    res.status(500).send('Error uploading files');
  }
});


// Update route to handle array file upload
app.post('/Update/Data', upload, async (req, res) => {
  try {
    const files = req.files.files || [];
    const image = req.files.image || [];

    const {
      id,
      userName,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample,
    } = JSON.parse(req.body.record);

    // console.log('Username:', userName);

    // Get existing record from Kintone
    const getExistingRecord = async (id) => {
      const response = await axios.get(`https://n3naf1x3ct3n.cybozu.com/k/v1/record.json`, {
        params: {
          app: 151,
          id: id,
        },
        headers: {
          'X-Cybozu-API-Token': 't19RVxAK2wOlNk31iCtOrGaeMnTzf6WUa22dp7Wu',
        },
      });
      return response.data.record;
    };

    const existingRecord = await getExistingRecord(id);

    const uploadFileToKintone = async (file) => {
      const filePath = file.path;
      const fileContent = fs.readFileSync(filePath);
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath), {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      const response = await axios.post('https://n3naf1x3ct3n.cybozu.com/k/v1/file.json', formData, {
        headers: {
          'X-Cybozu-API-Token': 't19RVxAK2wOlNk31iCtOrGaeMnTzf6WUa22dp7Wu',
          ...formData.getHeaders(),
        },
      });
      return response.data.fileKey;
    };

    let fileKeys = [];
    if (files.length > 0) {
      for (const file of files) {
        fileKeys.push({ fileKey: await uploadFileToKintone(file) });
        fs.unlinkSync(file.path);
      }
      // console.log('File keys:', fileKeys);
    } else {

      fileKeys = existingRecord.FILE.value.map(file => ({ fileKey: file.fileKey }));
    }

    let imageKey = '';
    if (image.length > 0) {
      const img = image[0];
      if (img.path) {
        imageKey = await uploadFileToKintone(img);
        fs.unlinkSync(img.path);
      } else {
        console.error('Image path is not defined');
      }
    } else {

      if (existingRecord.IMAGE.value.length > 0) {
        imageKey = existingRecord.IMAGE.value[0].fileKey;
      }
    }

    const recordData = {
      app: 151,
      id: id,
      record: {
        CerateBy: { value: userName },
        LIB_NAME: { value: libraryName },
        DESCRIPTION: { value: description },
        REFERENCE: { value: reference },
        DESCRIPTIONS_OVER: { value: overviewDes },
        DESCRIPTIONS_INS: { value: installationDes },
        DESCRIPTIONS_HTU: { value: HowToUseDes },
        DESCRIPTIONS_EXP: { value: exampleDes },
        DESCRIPTIONS_SGT: { value: suggestionDes },
        INSTALLATIONS: {
          value: rowsInstallations.map(item => ({
            value: {
              TITLE_INS: { value: item.title },
              CONTENT_INS: { value: item.description },
              EXAMPLE_INS: { value: item.example },
            },
          })),
        },
        HOWTOUSE: {
          value: rowsHowToUse.map(item => ({
            value: {
              TITLE_HTU: { value: item.title },
              CONTENT_HTU: { value: item.description },
              EXAMPLE_HTU: { value: item.example },
            },
          })),
        },
        EXAMPLE: {
          value: rowsExample.map(item => ({
            value: {
              TITLE_EXP: { value: item.title },
              CONTENT_EXP: { value: item.description },
              EXAMPLE_EXP: { value: item.example },
            },
          })),
        },
        FILE: { value: fileKeys },
        IMAGE: {
          value: imageKey ? [{ fileKey: imageKey }] : [],
        },
      },
    };
    // console.log('Record data:', recordData);

    const recordResponse = await axios.put('https://n3naf1x3ct3n.cybozu.com/k/v1/record.json', recordData, {
      headers: {
        'X-Cybozu-API-Token': 't19RVxAK2wOlNk31iCtOrGaeMnTzf6WUa22dp7Wu',
        'Content-Type': 'application/json',
      },
    });

    // console.log('Record response:', recordResponse.data);
    res.json(recordResponse.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error uploading files');
  }
});

// Delete record according ID
app.delete('/delete/record/:id', async (req, res) => {
  // Kintone client configuration
  const kintoneCliented = new KintoneRestAPIClient({
    baseUrl: 'https://n3naf1x3ct3n.cybozu.com',
    auth: {
      apiToken: 't19RVxAK2wOlNk31iCtOrGaeMnTzf6WUa22dp7Wu',
    },
  });

  const { id } = req.params;
  try {
    await kintoneCliented.record.deleteRecords({
      app: 151,
      ids: [id],
    });

    res.json({ message: `Record with ID ${id} has been deleted successfully` });
  } catch (error) {
    console.error('Error deleting Kintone record:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// get file image
app.get('/api/image/:imageKey', async (req, res) => {
  try {
    const { imageKey } = req.params;
    // console.log('key:', imageKey);
    // console.log(`Fetching file with key: ${imageKey}`);
    const kintoneClient = {
      file: {
        downloadFile: async ({ fileKey: imageKey }) => {
          // Replace with actual kintone API call using axios or any HTTP client
          const response = await axios.get(`https://n3naf1x3ct3n.cybozu.com/k/v1/file.json`, {
            params: { fileKey: imageKey },
            headers: {
              'X-Cybozu-API-Token': 't19RVxAK2wOlNk31iCtOrGaeMnTzf6WUa22dp7Wu' // Replace with your actual API token
            },
            responseType: 'arraybuffer'
          });
          return response;
        }
      }
    };


    const response = await kintoneClient.file.downloadFile({
      fileKey: imageKey,
    });

    // console.log('Kintone API response:', response);

    if (!response || !response.data) {
      throw new Error('Invalid response from Kintone API');
    }

    // Extract content type from response headers or set a default
    const contentType = response.headers['content-type'] || 'application/octet-stream';

    // Create a readable stream directly from the buffer
    const fileStream = Readable.from(response.data);

    res.setHeader('Content-Type', contentType);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error fetching file from Kintone:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

//get file
app.get('/api/file/:fileKey', async (req, res) => {
  try {
    const { fileKey } = req.params;
    // console.log('key:', fileKey);
    // console.log(`Fetching file with key: ${fileKey}`);
    const kintoneClient = {
      file: {
        downloadFile: async ({ fileKey }) => {
          const response = await axios.get(`https://n3naf1x3ct3n.cybozu.com/k/v1/file.json`, {
            params: { fileKey },
            headers: {
              'X-Cybozu-API-Token': 't19RVxAK2wOlNk31iCtOrGaeMnTzf6WUa22dp7Wu'
            },
            responseType: 'arraybuffer'
          });
          return response;
        }
      }
    };

    const response = await kintoneClient.file.downloadFile({
      fileKey: fileKey,
    });

    // console.log('Kintone API response:', response);

    if (!response || !response.data) {
      throw new Error('Invalid response from Kintone API');
    }

    // Extract content type from response headers or set a default
    const contentType = response.headers['content-type'] || 'application/octet-stream';

    // Create a readable stream directly from the buffer
    const fileStream = Readable.from(response.data);

    res.setHeader('Content-Type', contentType);
    // Pipe the stream to the response object
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error fetching file from Kintone:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});