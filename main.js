import express from 'express';
import { verify } from './google.js';

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';

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





function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

app.get('/restricted', restrict, function (req, res) {
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/')));

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

// app.get('/', function (req, res) {
//   var body = '';
//   if (req.session.views) {
//     ++req.session.views;
//   } else {
//     req.session.views = 1;
//     body += '<p>First time visiting? view this page in several browsers :)</p>';
//   }
//   res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
// });


//app.use(logger(':method :url'))


app.all('/', (req, res) => {

  res.render('index', {
    body: JSON.stringify(req.body ?? ''),
    cookies: JSON.stringify(req.cookies ?? ''),
    CLIENT_ID: process.env.CLIENT_ID,
    user: req.session.user
  });
});



const port = process.env.PORT || 3000;

process.env.CLIENT_ID = '560954844311-54a76cjs4s8q5ffchffi8fpkvkh92h2r.apps.googleusercontent.com';

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})