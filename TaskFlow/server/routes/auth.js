import express from 'express'
import passport from 'passport'

const router = express.Router()

// Login success route
router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({ success: true, user: req.user })
    }
})

// Login failed route
router.get('/login/failed', (req, res) => {
    res.status(401).json({ success: false, message: "failure" })
})

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }

        req.session.destroy((err) => {
            res.clearCookie('connect.sid')
            res.json({ status: "logout", user: {} })
        })
    })
})

// GitHub authentication route
router.get(
    '/github',
    passport.authenticate('github', {
        scope: [ 'read:user' ]
    })
)

// GitHub callback route
router.get(
    '/github/callback',
    passport.authenticate('github', {
        successRedirect: process.env.CLIENT_URL || 'http://localhost:5173',
        failureRedirect: (process.env.CLIENT_URL || 'http://localhost:5173') + '/login/failed'
    })
)

export default router
