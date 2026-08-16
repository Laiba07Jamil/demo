const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")
const taskRoutes  = require("./routes/taskRoutes")


app.use(
    cors({origin : process.env.CLIENT_URL || "http://localhost:5173",})
)
app.use(express.json())

app.get("/api/health" , (req,res) => {
    res.json({status : "ok"})
})

app.use("/api/auth",authRoutes)
app.use("/api/tasks" ,taskRoutes)

app.use((req,res) => {
    res.status(404).json({message : "Route not found"} )
})

const port = process.env.PORT;
app.listen(port,(req,res) => {
    console.log("Server started")
})