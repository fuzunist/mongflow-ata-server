const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

require("./config")();
require("./loaders")(server);
const {
  UserRoutes,
  CustomerRoutes,
  ProductRoutes,
  RecipeMaterialsRoutes,
  RecipeRoutes,
  OrderRoutes,
  StockRoutes,
  OtherRoutes,
  ProductionRoutes,
  SetRoutes,
  ExpensesRoutes,
} = require("./api-routes");

const port = process.env.APP_PORT || 4005;
app.set("port", port);
app.use(express.json({ limit: "2mb" }));
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: "GET,PATCH,POST,DELETE,PUT",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

server.listen(port, () => {
  console.log(`The server is running on port ${port}...`);
  app.use("/user", UserRoutes);
  app.use("/customer", CustomerRoutes);
  app.use("/product", ProductRoutes);
  app.use("/recipe", RecipeRoutes);
  app.use("/recipe/materials", RecipeMaterialsRoutes);
  app.use("/set", SetRoutes);
  app.use("/order", OrderRoutes);
  app.use("/stock", StockRoutes);
  app.use("/production", ProductionRoutes);
  app.use("/other", OtherRoutes);
  app.use("/expenses", ExpensesRoutes);
});
