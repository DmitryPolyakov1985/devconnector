const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {
    body,
    validationResult
} = require('express-validator');
const User = require('../../models/User');

// @route       GET api/auth
// @desc        Test route
// @access      Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            msg: "Server error"
        })
    }
});

// @route       POST api/auth
// @desc        Authenticate user & get token
// @access      Public
router.post('/', [
    body('email', "Please include a valid email").isEmail(),
    body('password', "Password is required").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        email,
        password
    } = req.body;

    try {
        let user = await User.findOne({
            email
        })
        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: "Invalid credentials"
                }]
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                errors: [{
                    msg: "Invalid credentials"
                }]
            });
        }

        // return jsonwebtoken
        const payload = {
            user: {
                id: user._id
            }
        }

        jwt.sign(payload, config.get("jwtSecret"), {
            expiresIn: "3h"
        }, (err, token) => {
            if (err) {
                throw err;
            } else {
                res.json({
                    token
                })
            }
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server error`);
    }
});

module.exports = router;