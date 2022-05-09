import express from 'express';
import { AdminAuthMiddleware, AuthMiddleware } from './libs/auth';
import { readSettings, writeSettings } from './settings';

const app = express();

app.use(express.json());

app.use(AuthMiddleware);

app.get('/settings', (req, res) => {
  readSettings().then(settings => {
    res.json(settings);
  });
});

app.use(AdminAuthMiddleware);

app.put('/settings', (req, res) => {
  writeSettings(req.body);
  //TODO: Trigger update webhook
  res.json(readSettings());
});

app.listen(8000, () => {
  console.log('Server started on port 8000');
});
