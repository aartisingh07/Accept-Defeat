const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Node to use Google Public DNS for SRV queries

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'accept_defeat_secret_key_123'

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

//Middlewares
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected Successfully"))
.catch((err)=>console.log(err))

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        minlength : 3
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    skills : {
        type : [String], 
        default : ["None"]
    },
    points : {
        type : Number,
        default : 0
    },
    challengesSolved : {
        type : Number,
        default : 0
    },
    avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

const User = mongoose.model("User", userSchema)

const generateToken = (userId) => {
    return jwt.sign({id : userId}, JWT_SECRET, {expiresIn : '7d'})
}

app.get("/api/health", (req, res)=>{
    res.json({status : "ok", time : new Date() })
})

app.post("/api/auth/signup", async(req, res)=>{
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password) return res.status(400).json({message : "All fields are required"})
        
        const existingUser = await User.findOne({
            $or : [{ email: email.toLowerCase() }, { username }]
        })

        if(existingUser) return res.status(409).json({message : "Username or email already exists"})

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username : username.trim(),
            email : email.trim().toLowerCase(),
            password : hashedPassword
        })

        const token = generateToken(newUser._id)

        return res.status(200).json({
            user : {
                id : newUser._id,
                username : newUser.username,
                email : newUser.email
            },
            token
        })
    }
    catch(err) {
        console.error("Sign up error: ", err)
        return res.status(500).json({message : "Server error during registration"})
    }
})

app.post("/api/auth/login", async(req, res)=>{
    try {
        const {identifier, password} = req.body
        if(!identifier || !password) return res.status(400).json({message : "Email/username and password are required"})

        const user = await User.findOne({
            $or : [
                { email : identifier.trim().toLowerCase() },
                { username : identifier.trim() }
            ]
        })
        if(!user) return res.status(401).json({message : "Invalid credentials"})
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({message : "Invalid credentials"})

        const token = generateToken(user._id)
        return res.status(200).json({
            user : {
                id : user._id,
                username : user.username,
                email : user.email
            },
            token
        })
    }
    catch(err) {
        console.error("Login Error: ", err)
        return res.status(500).json({message : "Server error during login"})
    }
})

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' })
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    return res.status(200).json({message: 'If this email exists, password reset instructions have been sent.'});
  } 
  catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error during password reset' });
  }
});

const authenticateToken = (req, res, next)=>{
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    if(!token) return res.status(401).json({message : "Access token required"})
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({message : "Invalid or expired token"})
        req.userId = decoded.id
        next()
    })
}

app.get("/api/auth/me", authenticateToken, async(req, res)=>{
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user) return res.status(404).json({message : "User not found"})
        
        return res.status(200).json({
            id : user._id,
            username : user.username,
            email : user.email,
            skills : user.skills || ["React", "Node.js", "MongoDB", "JavaScript"],
            createdAt : user.createdAt
        })
    }
    catch(err) {
        console.error("Error in /api/auth/me: ", err)
        return res.status(500).json({message : "Internal Server Error"})
    }
})

app.post('/api/auth/logout', (req, res) => {
    return res.status(200).json({ message: 'Logged out successfully' });
});

app.post("/api/auth/me/skills",authenticateToken, async (req, res)=>{
    try {
        const { skills } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set : { skills }},
            { new : true }
        ).select("-password")

        return res.status(200).json({skills : user.skills})
    }
    catch(err) {
        return res.status(500).json({message : "Failed to Update Skills"})
    }
})

// GitHub OAuth
app.get("/api/auth/oauth/github", (req,res)=>{
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`
    res.redirect(redirectUri)
})

app.get("/api/auth/oauth/github/callback", async(req, res)=>{
    try {
        const {code} = req.query
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
            method : "POST",
            headers : {"Content-Type" : "application/json", Accept : "application/json"},
            body : JSON.stringify({
                client_id : process.env.GITHUB_CLIENT_ID,
                client_secret : process.env.GITHUB_CLIENT_SECRET,
                code
            })
        })

        const tokenData = await tokenRes.json()

        const userRes = await fetch("https://api.github.com/user", {
            headers : { Authorization : `Bearer ${tokenData.access_token}`}
        })

        const githubUser = await userRes.json()

        let user = await User.findOne({email : githubUser.email || `${githubUser.login}@github.com`})
        if(!user) {
            user = await User.create({
                username : githubUser.login,
                email : githubUser.email || `${githubUser.login}@github.com`,
                password : await bcrypt.hash(Math.random().toString(36), 10),
                avatar : githubUser.avatar_url
            })
        }

        const token = generateToken(user._id)
        return res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
    }
    catch(err) {
        console.error("Github OAuth Error: ", err)
        return res.redirect(`${CLIENT_URL}/auth/callback?error=OAuth+authentication+failed`);
    }
})

//Google OAuth
app.get("/api/auth/oauth/google", (req, res)=>{
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
        redirect_uri : 'http://localhost:5000/api/auth/oauth/google/callback',
        client_id : process.env.GOOGLE_CLIENT_ID,
        access_type : "offline",
        response_type : "code",
        prompt : 'consent',
        scope : [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ].join(" ")
    }

    const qs = new URLSearchParams(options)
    res.redirect(`${rootUrl}?${qs.toString()}`)
})

app.get("/api/auth/oauth/google/callback", async(req, res)=>{
    try {
        const {code} = req.query

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method : "POST",
            headers : {"Content-Type" : "application/x-www-form-urlencoded"},
            body : new URLSearchParams({
                code,
                client_id : process.env.GOOGLE_CLIENT_ID,
                client_secret : process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri : 'http://localhost:5000/api/auth/oauth/google/callback',
                grant_type : 'authorization_code'
            })
        })

        const tokenData = await tokenRes.json()

        const profileRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenData.access_token}`)
        const googleUser = await profileRes.json()

        let user = await User.findOne({email : googleUser.email.toLowerCase()})
        if(!user) {
            user = await User.create({
                username : googleUser.name.replace(/\s+/g, '_').toLowerCase(),
                email : googleUser.email.toLowerCase(),
                password : await bcrypt.hash(Math.random().toString(36), 10),
                avatar : googleUser.picture
            })
        }

        const token = generateToken(user._id)
        return res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
    }
    catch(err) {
        console.error("Google OAuth Error: ", err)
        return res.redirect(`${CLIENT_URL}/auth/callback?error=OAuth+authentication+failed`);
    }
})

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));