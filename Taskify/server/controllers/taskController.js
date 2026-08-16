const pool = require("../config/db")

exports.getTask = async (req,res) =>{
    try{
        const [rows] = await pool.query("select * from tasks where user_id = ?" , [req.user.id])
        res.json(rows)
    }
    catch{
        console.error(err)
        res.status(400).json({message : "Server error during getting task"})
    }
}

exports.createTask = async(req,res) => {
    try{
        const [title , description , priority , status] = req.body
        if(!title){
            res.status(400).json({message : "This field s required"})
        }
        const [result] = await pool.query("insert into tasks(user_id,title,description,priority,status) values ()",
            [req.user.id,
                title,
                description || " ",
                priority || "low",
                status || "yet to start"
            ]
        )
        const [rows] = await pool.query("select * from tasks where id = ?",[result.insertid])
        res.status(200).json(rows[0])
    }
    catch{
        console.error(err)
        res.status(400).json({message : "Server error during creating task"})
    }
}

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;

    const [existing] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    await pool.query(
      `UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?
       WHERE id = ? AND user_id = ?`,
      [
        title ?? existing[0].title,
        description ?? existing[0].description,
        priority ?? existing[0].priority,
        status ?? existing[0].status,
        id,
        req.user.id,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      "SELECT id FROM tasks WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [id, req.user.id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};


