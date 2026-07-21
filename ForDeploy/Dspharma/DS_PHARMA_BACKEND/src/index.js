import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 3000;

connectDB()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log('Error connecting to MongoDB', error);
    process.exit(1);
  });
