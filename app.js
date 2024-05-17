const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

// Morgan Import
const morgan = require('morgan');
// Database Import
const connectDB = require('./db/connect');
// Error Import
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// Routers
const authRouter = require('./routes/authRoutes');

// Middleware
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('e-commerce api');
});

app.use('/api/v1/auth', authRouter);

// Errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// PORT
const port = process.env.PORT || 5050;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on a port ${port}...`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
