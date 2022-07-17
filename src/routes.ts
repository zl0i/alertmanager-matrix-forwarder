import { Router } from 'express'
import metrics from './prometheus';
import AlertService from './service';

const router = Router()

router.get('/', (_req, res) => {
  res.send('Hey 👋');
})

router.get('/metrics', metrics.controller())

router.post('/alerts', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== process.env.APP_ALERTMANAGER_SECRET) {
    res.status(403).end();
    return;
  }
  try {
    metrics.alertsCounter.inc()
    const data = await AlertService.sendAlers(req.body)
    res.json(data)
  } catch (error) {
    metrics.sendErrorCounter.inc()
    res.json({ result: error.message });
  }
})

export default router


