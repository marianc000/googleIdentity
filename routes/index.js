import { Router } from 'express';
const router = Router();
export default router;

router.get('/', (req, res) => {
  res.render('index', {
    user: req.session.user
  });
});

router.use((req, res, next) => {
  if (req.session.user)
    next();
  else
    res.redirect('/');
});

router.get('/aboutme', (req, res) => {
  res.render('aboutme', {
    user: req.session.user
  });
});