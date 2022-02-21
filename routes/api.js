import data from './data.js';
import { Router } from 'express';
const router = Router();
export default router;

router.use((req, res, next) => {
  if (req.session.user)
    next();
  else
    res.sendStatus(401);
});

router.get('/top', (req, res) => {
  res.send(data);
});
