import { Router } from 'express';
const router = Router();
export default router;

router.get('/', (req, res) => {
  res.render('index', {
    CLIENT_ID: process.env.CLIENT_ID,
    user: req.session.user
  });
});

router.use((req, res, next) => {
  if (req.session.user)
    next();
  else
    res.redirect('/');
});

router.get('/preferences', (req, res) => {
  res.render('preferences', {
    user: req.session.user
  });
});