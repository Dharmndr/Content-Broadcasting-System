import express from 'express';
import authRoutes from './auth.routes.js';
import contentRoutes from './content.routes.js';
import scheduleRoutes from './schedule.routes.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/content',
    route: contentRoutes,
  },
  {
    path: '/schedule',
    route: scheduleRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
