const passportLocal = require('passport-local');
const localStrategy = passportLocal.Strategy;
const bcrypt = require('bcrypt');
const prisma = require('../db/index');

function setupPassportLocal(passport) {
    passport.use(
        new localStrategy(
            {
                usernameField: "email",
                passwordField: "password",
            },

            async function (email, password, done) {
                try {
                  // Find user by email
                  const user = await prisma.user.findFirstOrThrow({
                    where: { email: email },
                  });
        
                  // Verify user and password
                  if (!user || !(await bcrypt.compare(password, user.password))) {
                    return done(false, null);
                  }
        
                  //Return the user to passport
                  //First is an error, second is any user info
                  return done(null, user);
                } catch (error) {
                  console.error(`error`, error);
                  return done(error, null);
                }
              }
        ),

    )
    
    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
          return cb(null, {
            id: user.id,
            email: user.email
          });
        });
      });
      
      passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
          return cb(null, user);
        });
      });

}

//Simple check to see if the user is authenticated via Passport
//since Passport adds other methods into the req object of Express
function checkIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.redirect("/login");
    }
  }

  module.exports = { setupPassportLocal, checkIfAuthenticated };