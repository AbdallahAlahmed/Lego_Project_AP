import express, { Request, Response } from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import { MongoClient, MongoClientOptions, Db } from 'mongodb';

const app = express();
const url = "mongodb+srv://UserLego:UserTeamLego@lego.u2sfsfn.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'IT-PROJECT'; // Replace with your database name
const client = new MongoClient(url)

app.set("view engine", "ejs");
app.set("port", 8080);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
client.connect()
  .then((client) => {
    const db = client.db(dbName);
    console.log('Connected to MongoDB');

    app.get('/', (req: Request, res: Response) => {
      res.render('index');
    });

    app.get('/home', (req: Request, res: Response) => {
      res.render('home');
    });

    app.get('/bekijk', (req: Request, res: Response) => {
      res.render('bekijk');
    });

    app.get('/ordenen', (req: Request, res: Response) => {
      res.render('ordenen');
    });

    app.get('/blacklist', (req: Request, res: Response) => {
      res.render('blacklist');
    });

    app.get('/login', (req: Request, res: Response) => {
      res.render('login');
    });

    app.post('/api/register', (req: Request, res: Response) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Insert the user document into the 'users' collection
      db.collection('users').insertOne({ username, password })
        .then(() => {
          res.status(200).json({ message: 'Registration successful!' });
        })
        .catch((error) => {
          console.error('Error registering user', error);
          res.status(500).json({ message: 'Registration failed. Please try again.' });
        });
    });

    app.post('/api/login', (req: Request, res: Response) => {
      const { username, password } = req.body;

      // Find a user with the provided username and password in the 'users' collection
      db.collection('users').findOne({ username, password })
        .then((user) => {
          if (user) {
            res.status(200).json({ message: 'Login successful!' });
          } else {
            res.status(401).json({ message: 'Login failed. Please try again.' });
          }
        })
        .catch((error) => {
          console.error('Error logging in', error);
          res.status(500).json({ message: 'An error occurred. Please try again later.' });
        });
    });

    app.listen(app.get("port"), () => {
      console.log(`Server is running on port ${app.get("port")}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
