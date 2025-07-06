import { verifyToken } from '../../guard/authGuard.js';
import incomeRoutes from './incomeRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import profileRoutes from './profileRoutes.js'
import stakingRoutes from './stakingRoutes.js'

const all = [verifyToken].concat(incomeRoutes,dashboardRoutes,profileRoutes, stakingRoutes);

export default all;