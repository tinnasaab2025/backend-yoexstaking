import userAuthRoutes from './userAuthRoutes.js'
import adminAuthRoutes from './adminAuthRoutes.js';

const all = [].concat(userAuthRoutes, adminAuthRoutes)

export default all;