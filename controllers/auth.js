const { User } = require('../models/user.js');
const generateTokens = require('../utils/generateTokens.js');

module.exports.register = async function (req, res, next) {
  try {
    // ***** step 1 ***** check if username, email, password are passed trough request
    // I don't need to validate, just check if arguments are passed
    // if some argument is missing -> 400 Bad Request
    const { username, password, email } = req.body;
    console.log(username + ' ' + password + ' ' + email + '\n');
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // ***** step 2 ***** check if there is already a user with this email in database
    // there CANNOT be to -> email is unique
    // if user with this email address already exists -> 409 Conflicted
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email address already exists.' });
    }

    // ***** step 3 ***** create new user and save it in the database
    const newUser = new User({
      username,
      password,
      email
    });
    console.log(newUser instanceof User);
    // on save -> mongoose middleware 'pre' hook will activate and hash the password -> no worries :)
    await newUser.save();

    // ***** step 4 ***** generate Refresh and Access token and asign newUser with both
    // access token will be passed trough res body
    // refresh token will be stored in http-only cookies for security reasons
    const userId = newUser._id; // use userId for token payload
    const { accessToken, refreshToken } = generateTokens(userId);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // this cookie will last for 7 days (same as Refresh token)
    });

    return res.status(201).json({
      message: 'User is succesfully registered.',
      accessToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.', errorMessage: error.message });
  }
};
