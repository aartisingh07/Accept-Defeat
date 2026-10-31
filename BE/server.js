const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Node to use Google Public DNS for SRV queries

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

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
    usernameLastChangedAt :{
        type : Date,
        default : null
    },
    name : {
        type : String,
        trim : true,
        default : ""
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
    phone : {
        type : String,
        default : null
    },
    phoneVisibility : {
        type : String,
        enum : ["private", "public"],
        default : 'private'
    },
    socialLinks : {
        linkedin : { type : String, default : ""},
        github : { type : String, default : ""},
        leetcode : { type : String, default : ""},
        other : [{name : { type : String, trim : true}, url : { type : String, trim : true }}]
    },
    skills : {
        type : [String], 
        default : []
    },
    points : {
        type : Number,
        default : 0
    },
    rank : {
        type : Number,
        default : 0
    },
    challengesSolved : {
        type : Number,
        default : 0
    },
    battlesWon : {
        type : Number,
        default : 0
    },
    avatar: {
        type: String,
        default: '/default-avatar.png',
    },
    avatarPublicId: {
        type: String,
        default: null,
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

const User = mongoose.model("User", userSchema)

const IDLE_TIMEOUT_MS = 15 * 60 * 1000 //15 Minutes
const ABSOLUTE_TIMEOUT_MS = 8 * 60 * 60 * 1000 //8 Hours
const ACTIVITY_THROTTLE_MS = 60 * 1000 //Database update at most once per 60s

//Session Schema
const sessionSchema = new mongoose.Schema({
    userId : { type : mongoose.Schema.Types.ObjectId,  ref : 'User', required : true },
    tabId : { type : String, required : true },
    lastActivity : { type : Date, default : Date.now },
    createdAt : { type : Date, default : Date.now },
    isRevoked : { type : Boolean, default : false },
    isClosed : { type: Boolean, default : false }
})

sessionSchema.index(
    {userId : 1},
    {unique : true, partialFilterExpression : { isRevoked : false }}
)

const Session = mongoose.model("Session", sessionSchema)

const createSessionToken = async (userId, tabId = "default-tab", forceReset = false)=>{
    const now = Date.now() 

    await Session.updateMany({
        userId,
        isRevoked : false,
        $or : [
            {createdAt : {$lt : new Date(now - ABSOLUTE_TIMEOUT_MS)}},
            {lastActivity : {$lt : new Date(now - IDLE_TIMEOUT_MS)}}
        ]
    },
    { $set : { isRevoked : true }})

    const activeSession = await Session.findOne({userId, isRevoked : false})
    if(activeSession) {
        if(activeSession.isClosed) {
            activeSession.isRevoked = true
            await activeSession.save()
        }
        else if(activeSession.tabId != tabId && !forceReset) {
            const conflictErr = new Error("This account is already active in another tab. Please use a different account")
            conflictErr.statusCode = 409
            conflictErr.code = "ACCOUNT_ACTIVE_ANOTHER_TAB"
            throw conflictErr
        }
        else {
            activeSession.isRevoked = true
            await activeSession.save()
        }
    }

    try {
        const session = await Session.create({
            userId,
            tabId,
            lastActivity : new Date(now),
            createdAt : new Date(now),
            isRevoked : false
        })

        const token = jwt.sign(
            {id : userId, sessionId : session._id, tabId : session.tabId},
            JWT_SECRET,
            { expiresIn : '8h'}
        )
        return { token, session }
    }
    catch(err) {
        if(err.code == 11000) {
            const conflictErr = new Error("This account is already active in another tab")
            conflictErr.statusCode = 409
            conflictErr.code = "ACCOUNT_ACTIVE_ANOTHER_TAB"
            throw conflictErr
        }
        throw err
    }
}

const generateToken = (userId) => {
    return jwt.sign({id : userId}, JWT_SECRET, {expiresIn : '7d'})
}

app.get("/api/health", (req, res)=>{
    res.json({status : "ok", time : new Date() })
})

app.post("/api/auth/signup", async(req, res)=>{
    try {
        const {username, email, password, tabId} = req.body;
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

        const { token } = await createSessionToken(newUser._id, tabId)

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
        const {identifier, password, tabId, forceReset} = req.body
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

        const { token } = await createSessionToken(user._id, tabId, forceReset)
        return res.status(200).json({
            user : {
                id : user._id,
                username : user.username,
                name : user.name || "",
                email : user.email
            },
            token
        })
    }
    catch(err) {
        if (err.statusCode === 409) return res.status(409).json({ message: err.message, code: err.code });
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
    const clientTabId = req.headers["x-tab-id"]

    if(!token) return res.status(401).json({message : "Access token required"})
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if(err) return res.status(401).json({message : "Token Expired or invalid", code : "TOKEN_EXPIRED"})
        if(decoded.tabId && clientTabId && decoded.tabId != clientTabId) return res.status(401).json({message : "Token does not belong to this browser tab", code : "TAB_MISMATCH"})
        if(decoded.sessionId) {
            try {
                const session = await Session.findById(decoded.sessionId)
                if(!session || session.isRevoked) return res.status(401).json({message : "Session revoked or not found", code : "SESSION_REVOKED"})
                
                const now = Date.now()
                const createdAt = new Date(session.createdAt).getTime()
                const lastActivity = new Date(session.lastActivity).getTime()

                if(now - createdAt > ABSOLUTE_TIMEOUT_MS) {
                    session.isRevoked = true
                    await session.save()
                    return res.status(401).json({message : "Session expired (8-hour limit reached). Please log in again", code : "SESSION_EXPIRED"})
                }

                if(now - lastActivity > IDLE_TIMEOUT_MS) {
                    session.isRevoked = true
                    await session.save()
                    return res.status(401).json({message : "Your session expired due to inactivity. Please log in again", code : "SESSION_IDLE"})
                }

                if(now - lastActivity > ACTIVITY_THROTTLE_MS) {
                    session.lastActivity = new Date(now)
                    await session.save()
                }

                if(session.isClosed) {
                    session.isClosed = false;
                    await session.save();
                }
                req.session = session
            }
            catch(dbErr) {
                console.error("Sessin lookup Error : ", dbErr)
                return res.status(500).json({message : "Session verification error"})
            }
        }    
        req.userId = decoded.id
        next()
    })
}
const profileRoutes = require("./routes/profileRoutes")
app.use("/api/users", profileRoutes(authenticateToken))

app.get("/api/auth/me", authenticateToken, async(req, res)=>{
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user) return res.status(404).json({message : "User not found"})
        
        return res.status(200).json({
            id : user._id,
            username : user.username,
            name : user.name || "",
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

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
        if(req.session) {
            req.session.isRevoked = true
            await req.session.save()
        }
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    catch(err) {
        return res.status(200).json({message : "Session cleared"})
    }
});

app.post("/api/auth/tab-closed", async (req, res) => {
    try {
        const tabId = req.query.tabId || req.body?.tabId;
        if (tabId) await Session.updateMany({ tabId, isRevoked: false }, { $set: { isClosed: true } });
        return res.status(200).send("OK");
    } catch {
        return res.status(200).send("OK");
    }
});

app.post("/api/auth/activity", authenticateToken, async(req, res)=>{
    return res.status(200).json({status : "active", lastActivity : req.session?.lastActivity})
})

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
    const tabId = req.query.tabId || "";
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&state=${encodeURIComponent(tabId)}`;

    res.redirect(redirectUri)
})

app.get("/api/auth/oauth/github/callback", async(req, res)=>{
    try {
        const {code, state : tabId} = req.query
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

        const { token } = await createSessionToken(user._id, tabId)
        return res.redirect(`${CLIENT_URL}/auth/callback?token=${token}&tabId=${encodeURIComponent(tabId || " ")}`);
    }
    catch(err) {
        console.error("Github OAuth Error: ", err);
        const errMsg = err.statusCode === 409
            ? "This account is already active in another tab. Please use a different account."
            : "OAuth authentication failed";
        return res.redirect(`${CLIENT_URL}/auth/callback?error=${encodeURIComponent(errMsg)}`);
    }
})

//Google OAuth
app.get("/api/auth/oauth/google", (req, res)=>{
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const tabId = req.query.tabId || " "
    const options = {
        redirect_uri : 'http://localhost:5000/api/auth/oauth/google/callback',
        client_id : process.env.GOOGLE_CLIENT_ID,
        access_type : "offline",
        response_type : "code",
        prompt : 'consent',
        state : tabId,
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
        const {code, state : tabId} = req.query

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

        const { token } = await createSessionToken(user._id, tabId)
        return res.redirect(`${CLIENT_URL}/auth/callback?token=${token}&tabId=${encodeURIComponent(tabId || " ")}`);
    }
    catch(err) {
        console.error("Google OAuth Error: ", err);
        const errMsg = err.statusCode === 409
            ? "This account is already active in another tab. Please use a different account."
            : "OAuth authentication failed";
        return res.redirect(`${CLIENT_URL}/auth/callback?error=${encodeURIComponent(errMsg)}`);
    }
})

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));