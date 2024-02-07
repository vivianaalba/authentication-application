// Import necessary modules
const express = require('express');
const prisma = require('../db');
const {checkIfAuthenticated} = require('../middleware/authMiddleware');

//4.3.1
const router = express.Router();

// 4.3.2
router.post("/create-post", checkIfAuthenticated, async (req, res) => {
    //4.3.3

    try {

        // Destructure title and content from req.body
        const { title, content } = req.body;

        // Check if title and content are provided
        if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
        }

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

        // redirects to dashboard after sucessful post
        res.redirect("/dashboard");  

    } 
    
    catch (error) {
      console.error(error); 
      res.status(500).json({ error: "Internal Server Error" }); 
    }

});

// Export the router
module.exports = router;