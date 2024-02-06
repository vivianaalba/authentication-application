const express = require('express');
const prisma = require('../db/index.js');
const authMiddleware = require('./authMiddleware');
const { checkIfAuthenticated } = require('../middleware/authMiddleware.js');
const router = express.Router();
const prisma = require("prisma");

// 4.1.1
router.get('/', async (req, res) => {
    try {
        // Render the index.ejs file
        res.render('index.ejs', null);
    } catch (error) {
        // Handle errors
        console.error('Error rendering index:', error);
        res.status(500).send('Internal Server Error');
    }
});

//4.1.2
router.get('/login', async (req, res) => {
    try {
        // Render the login.ejs file
        res.render('login.ejs', null);
    } catch (error) {
        // Handle errors
        console.error('Error rendering login:', error);
        res.status(500).send('Internal Server Error');
    }
});

//4.1.3
router.get('/signup', async (req, res) => {
    try {
        // Render the create-post.ejs file
        res.render('signup.ejs');
    } catch (error) {
        // Handle errors
        console.error('Error rendering create-post:', error);
        res.status(500).send('Internal Server Error');
    }
});

//4.1.4
router.get('/dashboard', authMiddleware.checkIfAuthenticated, async(req, res) => {
    // Use the userId from Passport
  const userId = req.user.id;

  try {
    // Fetch user's posts from the database
    const userPosts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
    });

    // Render the 'dashboard.ejs' file with userPosts data
    res.render("dashboard", { userPosts, error: false });
  } catch (error) {
    console.error(error);
    // Instead of just sending an error for the browser to handle,
		// we would display the dashboard page with an error message
    res.render("dashboard", { userPosts: null, error: true });
  }
});

//4.1.5
router.get('/create-post', authMiddleware.checkIfAuthenticated, async (req, res) => {
    try {
        // Render the create-post.ejs file
        res.render('create-post', null);
    } catch (error) {
        // Handle errors
        console.error('Error rendering create-post:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Export the router
module.exports = {router};
