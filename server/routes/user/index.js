import { verifyToken } from '../../guard/authGuard.js';
import incomeRoutes from './incomeRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import profileRoutes from './profileRoutes.js'

const all = [verifyToken].concat(incomeRoutes,dashboardRoutes,profileRoutes);

export default all;