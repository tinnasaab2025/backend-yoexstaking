import { verifyToken } from '../../guard/authGuard.js';
import incomeRoutes from './incomeRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import profileRoutes from './profileRoutes.js'
import stakingRoutes from './stakingRoutes.js'
import ticketRoutes from './ticketRoutes.js';
import uploadRoutes from './uploadRoute.js';

const all = [verifyToken].concat(incomeRoutes,dashboardRoutes,profileRoutes, stakingRoutes,ticketRoutes,uploadRoutes);

export default all;