const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const {createTask , deleteTask , updateTask , getTask} = require("../controllers/taskController")

router.use(protect)

router.get("/",getTask)
router.post("/" , createTask)
router.put("/:id",updateTask)
router.delete("/:id",deleteTask)

module.exports = router