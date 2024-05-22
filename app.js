const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// Morgan Import
const morgan = require('morgan');
// Database Import
const connectDB = require('./db/connect');
// Error Import
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// Routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('e-commerce api');
});

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  res.send('e-commerce api');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

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
