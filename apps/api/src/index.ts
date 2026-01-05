import dotenv from 'dotenv';
import path from 'path';
import app from './app';

// Try to load from root .env first, then local
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
