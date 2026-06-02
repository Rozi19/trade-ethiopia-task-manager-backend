const express = require("express");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* =========================
   MIDDLEWARE
========================= */
const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.send("No token, access denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.send("Invalid token");
  }
};

router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


/* =========================
   CREATE TASK 
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.id
    });

    await task.save();
    res.json({
      message: "Task created",
      task
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   GET TASKS 
========================= */
router.get("/stats", protect, async (req, res) => {
  try {
    const total = await Task.countDocuments({ userId: req.user.id });
    const pending = await Task.countDocuments({ 
      userId: req.user.id,
      status: "pending"
    });
    const completed = await Task.countDocuments({ 
      userId: req.user.id,
      status: "completed"
    });

    res.json({
      total,
      pending,
      completed
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// update 

router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) return res.send("Task not found");

    res.json({
      message: "Task updated",
      task
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
 // delete
 router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) return res.send("Task not found");

    res.send("Task deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;