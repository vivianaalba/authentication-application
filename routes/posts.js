// Import necessary modules
const express = require('express');
const prisma = require('./db/index');
const { checkIfAuthenticated } = require('./authMiddleware');

//4.3.1
const router = express.Router();



    // 4.3.2
    router.post("/create-post", checkIfAuthenticated, async (req, res) => {
        //4.3.3
        try {
            // Deconstruct title and content variables stored at req.body
            const { title, content } = req.body;

            // Create a variable userId assigned to req.user.id
            const userId = req.user.id;

            // Create a new post associated with the userId
            await prisma.post.create({
                data: {
                    title,
                    content,
                    userId,
                },
            });

            // Redirect to the dashboard page
            res.redirect("/dashboard");
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    return router;
