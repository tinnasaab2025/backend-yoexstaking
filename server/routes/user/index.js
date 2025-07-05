import { verifyToken } from '../../guard/authGuard.js';
import incomeRoutes from './incomeRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'

const all = [verifyToken].concat(incomeRoutes,dashboardRoutes)

export default all;