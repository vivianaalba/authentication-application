// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const prisma = require('./db/index');


    // 4.2.1
    const router = express.Router();

    // 4.2.2
    router.post("/register", async (req, res) => {
        try {
            // Deconstruct email and password variables stored at req.body
            const { email, password } = req.body;

            // Generate userId without dashes (-) with a length of 12 characters
            const userId = uuidv4().replace(/-/g, "").slice(0, 24);

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user in the database with the generated userId
            const user = await prisma.user.create({
                data: {
                    id: userId,
                    email,
                    password: hashedPassword,
                },
            });

            // This uses one of passport's injected methods to login the user
            // after successful creation
            req.login({ id: user.id, email: user.email }, function (err) {
                // Error handling....could be better here.
                if (err) {
                    console.error(err);
                } else {
                    // Successful login sends the user to the dashboard
                    res.redirect("/dashboard");
                }
            });
        } 
        
        catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    // Route for user login
    router.post("/login", passport.authenticate('local', {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    }));

    // Route for user logout
    // req.logout will destroy the session that passport created
    router.post("/logout", function (req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/login");
        });
    });

    return router;
