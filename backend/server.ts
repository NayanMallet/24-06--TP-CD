import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Route /health pour le healthcheck Docker Swarm
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// Route /api/hello qui renvoie un objet JSON
app.get('/api/hello', (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello from the Node.js (TypeScript) Backend!",
    status: "success"
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
