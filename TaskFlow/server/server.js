import express from 'express'
import cors from 'cors'
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'

import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'

const app = express()

app.set('trust proxy', 1) // Trust first proxy

app.use(session({
    secret: 'codepath',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}))
app.use(express.json())

const allowedOrigins = [
    'https://taskflow-client-81p8.onrender.com',
    'http://localhost:5173'
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(GitHub)

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ TaskFlow API</h1>')
})

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/projects', projectRoutes)
app.use('/tasks', taskRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})