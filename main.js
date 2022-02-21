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
  name: "SESSIONID",
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'my secret phrase'
}));

app.post('/login', async function (req, res) {
  if (!req.cookies.g_csrf_token || !req.body.g_csrf_token
    || req.cookies.g_csrf_token !== req.body.g_csrf_token) throw 'Wrong csrf_token';

  const tiket = await verify(req.body.credential);
  console.log("ticket", tiket);
  req.session.regenerate(() => {
    req.session.user = tiket;
    res.redirect('/');
  });
})


app.use("/api", apiRouter);
app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/')));
app.use("/", indexRouter);


//app.use(logger(':method :url'))

const port = process.env.PORT || 3000;

console.log("CLIENT_ID",process.env.CLIENT_ID);
app.locals.clientId = process.env.CLIENT_ID;

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})