import express, { Request, Response } from 'express';
import os from 'os';

const app = express();
const PORT = process.env.PORT || 3000;

// Route /health pour le healthcheck Docker Swarm
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// Route /api/hello qui renvoie un objet JSON avec l'identifiant du conteneur (hostname)
app.get('/api/hello', (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello from the Node.js (TypeScript) Backend!",
    status: "success",
    containerId: os.hostname()
  });
});

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Backend server is running on port ${PORT}`);
});

