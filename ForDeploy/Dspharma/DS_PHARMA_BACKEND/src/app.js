import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

const app = express();

const masterSyncLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
});

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://192.168.0.113:5173',
      'http://192.168.0.168:5173',
      'http://192.168.0.123:5173',
      'https://www.dspharma.online',
      'https://dspharma.online',
      'https://dspharma.pages.dev',
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(morgan(':method :url :status - :response-time ms'));

// Cron jobs
import { syncMasterDataCron } from './cron/masterSync.cron.js';
syncMasterDataCron();

app.get('/status', (req, res) => {
  res.send('Server is running');
});

app.use("/downloads", express.static(path.join(process.cwd(), "public/downloads")));

// Routes import
import authRouter from './modules/auth/auth.route.js';
import categoryRouter from './modules/category/category.route.js';
import masterSyncRouter from './modules/mastersync/masterSync.route.js';
import productRoute from './modules/products/product.route.js';
import partyRouter, { partyAuthRouter } from './modules/party/party.route.js';
import orderRouter, { userOrder } from './modules/order/order.route.js';
import staffRouter from './modules/staff/staff.route.js';
import dashboardRouter from './modules/dashboard/dashboard.route.js';
import hsnRouter from './modules/hsncode/hsn.route.js';
import addressRouter from './modules/address/address.route.js';
import cartRouter from './modules/cart/cart.route.js';
import contactRouter from './modules/contact/contact.route.js';
import featuredRouter from './modules/featured/featured.route.js';
import titleRouter from './modules/title/title.route.js';
import wishlistRouter from './modules/wishlist/wishlist.route.js';

// Middleware import
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import path from 'path';

// Routes declaration
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/hsn', hsnRouter);
app.use('/api/v1/parties', partyRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/staff', staffRouter);
app.use('/api/v1/master-sync', masterSyncRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/contact', contactRouter);

app.use(titleRouter);
app.use(partyAuthRouter);
app.use(addressRouter);
app.use(cartRouter);
app.use(featuredRouter);
app.use(wishlistRouter);
app.use(userOrder);

// Global error handler - MUST be after all routes
app.use(errorHandler);

export default app;
