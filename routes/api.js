import data from './data.js';
import { Router } from 'express';
const router = Router();
export default router;

router.use((req, res, next) => {
  console.log(">api auth", req.session.user);
  if (req.session.user)
    next();
  else
    res.sendStatus(401);
});

router.get('/top', (req, res) => {
  console.log(">api top", req.session.user);
  res.send(data);
});
