import { verifyToken } from '../../guard/authGuard.js';
import incomeRoutes from './incomeRoutes.js'

const all = [verifyToken].concat(incomeRoutes)

export default all;