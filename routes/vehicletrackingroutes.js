import express from 'express';
const router = express.Router();

// Example route - you can add your actual vehicle tracking endpoints here
router.get('/', (req, res) => {
  res.send('Vehicle tracking route working!');
});

export default router;
