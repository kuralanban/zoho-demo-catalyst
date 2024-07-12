import express from "express";

export default (app) => {
  const router = express.Router();

  router.get("/routecheck", (req, res) => {
    res.json({ message: "Yes" });
  });
// This route is working when catalyst is serverd but not when its deployed 

  app.use("/", router);
};
