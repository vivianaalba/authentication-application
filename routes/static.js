const express = require('express');
const prisma = require('../db/index.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const router = express.Router();

// 4.1.1
router.get('/', async (req, res) => {
     // Render the index.ejs file
    res.render('index');
});

//4.1.2
router.get('/login', async (req, res) => {
    // Render the login.ejs file
    res.render('login');

});

//4.1.3
router.get('/signup', async (req, res) => {
    // Render the signup file
    res.render('signup');
});

//4.1.4
router.get('/dashboard', authMiddleware.checkIfAuthenticated, async(req, res) => {
    // Use the userId from Passport
  const userId = req.user.id;

  try {
    // Fetch user's posts from the database - acess if stored in user's credentials
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
    // render create-post file
    res.render('create-post');
});

// Export the router
module.exports = router;
