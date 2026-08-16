const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const pool = require("../config/db")
require("dotenv").config()

function generateToken(user) {
    return jwt.sign({id :user.id , email : user.email} ,process.env.JWT_SECRET, 
        {expiresIn : process.env.JWT_EXPIRES_IN || "7d"}
    )
}

exports.signup = async(req,res) => {
    const {name ,email , password} = req.body
    try{
        if(!name || !email || !password){
            return res.status(404).json({message : "All fields are required"})
        }
    const [existing] = await pool.query("SELECT id from users where email=?",[email])
    if(existing.length > 0){
        res.status(409).json({message : "Email already registered"})
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const [result] = await pool.query("insert into users(name,email,password) values(?,?,?)",[name,email,password])

    const user = {id : result.insertid , name , email}
    const token = generateToken(user)

    res.status(200).json({token,user})
    
}
    catch{
        console.error(err)
        res.status(500).json({message : "server error during sign up"})
    }
    
}

exports.login = async(req,res) => {
    try{
        const [email , password] = req.body
        if(!email || !password){
            res.status(401).json({message : "All feilds are required"})
        }
        const [rows] = await pool.query("select * from users where email=?", [email])
        if(rows.length === 0){
            res.status(400),json({message : "Invalid email or password"})
        }

        const user = rows[0]
        const match = await bcrypt.compare(password,user.password)
        if(!match){
            res.status(400).json({message : "Invalid email or password"})
        }
        const token = generateToken(user)
        res.json({token ,user : {id : user.id , name : user.name , email:user.email}})
    }
    catch{
        console.error(err)
        res.status(400).json({message : "Server error during login"})
    }
}