import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './trpc';
import { createContext } from './trpc/context';
import { rateLimiterMiddleware } from './utils/ratelimiter';

const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    rateLimiterMiddleware(req, res, next).catch(next);
});

app.use(
  '/trpc',
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'jobDescription', maxCount: 1 },
  ]),
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));