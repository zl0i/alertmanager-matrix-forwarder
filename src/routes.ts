import { Router } from 'express'
import AlertService from './service';

const router = Router()

router.get('/', (_req, res) => {
  res.send('Hey 👋');
})

router.post('/alerts', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== process.env.APP_ALERTMANAGER_SECRET) {
    res.status(403).end();
    return;
  }
  try {
    const data = await AlertService.sendAlers(req.body)
    res.json(data)
  } catch (error) {
    res.json({ result: error.message });
  }
})

export default router


