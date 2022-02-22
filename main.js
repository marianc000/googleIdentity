import express from 'express';
import { verify } from './google.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import indexRouter from './routes/index.js';
import apiRouter from './routes/api.js';

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const baseDir = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(baseDir, 'public')));
app.set('views', join(baseDir, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(session({
  secret: 'some string for generating session ids'
}));

app.post('/login', async (req, res) => {
  const user = await verify(req.body.credential);
  req.session.regenerate(() => {
    req.session.user = user;
    res.redirect('/');
  });
})

app.use("/api", apiRouter);
app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/')));
app.use("/", indexRouter);

app.use(logger(':method :url'))

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})