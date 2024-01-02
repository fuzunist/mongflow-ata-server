const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const cron = require("node-cron");

const app = express();
const server = http.createServer(app);

require("./config")();
require("./loaders")(server);
const {
  UserRoutes,
  CustomerRoutes,
  ProductRoutes,
  RecipeMaterialsRoutes,
  RawMaterialsRoutes,
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

cron.schedule(
  "01 00 1 * *",
  () => {
    process.pool
      .connect()
      .then((client) => {
        return client
          .query("SELECT clone_latest_expenses_row()")
          .then(() => {
            console.log("Row cloned successfully on the second day at 09:48");
            client.release(); // Release the client back to the pool
          })
          .catch((err) => {
            console.error("Error cloning row on the second day at 09:48:", err);
            client.release(); // Release the client back to the pool in case of an error
          });
      })
      .catch((err) => {
        console.error("Error connecting to the database:", err);
      });
  },
  {
    scheduled: true,
    timezone: "Europe/Istanbul", // Set your timezone to Europe/Istanbul or 'EET'
  }
);
server.listen(port, () => {
  console.log(`The server is running on port ${port}...`);
  app.use("/user", UserRoutes);
  app.use("/customer", CustomerRoutes);
  app.use("/product", ProductRoutes);
  app.use("/recipe", RecipeRoutes);
  app.use("/recipe/rawmaterials", RawMaterialsRoutes);
  app.use("/recipe/materials", RecipeMaterialsRoutes);
  app.use("/set", SetRoutes);
  app.use("/order", OrderRoutes);
  app.use("/stock", StockRoutes);
  app.use("/production", ProductionRoutes);
  app.use("/other", OtherRoutes);
  app.use("/expenses", ExpensesRoutes);
});
