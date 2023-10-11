import { dbConnection } from "../DB/dbConnection.js";
import path from "path";
import { config } from "dotenv";
config({ path: path.resolve("config/.env") });
const port = process.env.PORT || 3001;
import userRoutes from "./user/user.routes.js";
import categoryRoutes from "./category/category.routes.js";
import subCategoryRoutes from "./subCategory/subCategory.routes.js";
import brandRoutes from "./brand/brand.routes.js";
import productRoutes from "./product/product.routes.js";
import cartRoutes from "./cart/cart.routes.js";
import orderRoutes from "./order/order.routes.js";
import couponRoutes from "./coupon/coupon.routes.js";
import reviewRoutes from "./review/review.routes.js";
import { AppError, globalErrorHandel } from "../utils/globalError.js";
import morgan from "morgan";
export const initApp = (app, express) => {

  app.get("/", (req, res, next) => {
    return res.status(200).json({ msg: "welcome in my ecommerce" })
  })
  app.use((req, res, next) => {
    if (req.originalUrl == "/orders/webhook") {
      next()
    } else {
      express.json({})(req, res, next)
    }
  });
  //ammar
  //ahmed
  //anas
  app.use(morgan("dev"));
  app.use("/users", userRoutes);
  app.use("/categories", categoryRoutes);
  app.use("/subCategories", subCategoryRoutes);
  app.use("/brands", brandRoutes);
  app.use("/products", productRoutes);
  app.use("/carts", cartRoutes);
  app.use("/orders", orderRoutes);
  app.use("/coupons", couponRoutes);
  app.use("/reviews", reviewRoutes);

  app.use("*", (req, res, next) => {
    next(new AppError(`inValid path ${req.originalUrl}`, 404));
  });
  app.use(globalErrorHandel);

  dbConnection();
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
