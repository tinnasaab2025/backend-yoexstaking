import userRoutes from "./user/index.js";
import authRoutes from "./auth/index.js";
// import adminRoutes from "./admin/index.js";
const all = [].concat(authRoutes,userRoutes);

export default all;