import express from 'express';

import { getUserByEmail, createUser } from '../models/users';
import { random, authentication } from '../helpers';
import Logging from '../library/Logging';


// Login Controller
export const login = async (req: express.Request, res: express.Response) => {

  try {
    const { email, password } = req.body;
    // Check if there is an email and password
    if (!email || !password) {
      Logging.warning("Enter your Email and Password")
      return res.sendStatus(400)
    }

    // user - to access authentication and salt
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user) {
      Logging.warning("Unregister User")
      return res.sendStatus(400);
    }

    // Hash
    const expectedHash = authentication(user.authentication.salt, password);

    // Check if password is not equal to hash
    if (user.authentication.password != expectedHash) {
      Logging.warning("Invalid Hash")
      return res.sendStatus(403);
    }

    // Update Session Token
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    // Set Cookie
    res.cookie('JM-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
    Logging.info("Succesfully Login")

    return res.status(200).json(user).end();

  } catch (error) {
    Logging.error(error)
    return res.sendStatus(400)
  }
}


// Register Controller
export const register = async (req: express.Request, res: express.Response) => {
  //console.log("Jibreel Response")
  try {
    const { email, password, username } = req.body;
    console.log("Request Body Jibreel")
    console.log(req.body)
    console.log(email)
    console.log(password)
    console.log(username)

    // Check if all field is present
    if (!email || !password || !username) {
      Logging.warning("One or more fieds are missing. Sending 400 status...")
      return res.sendStatus(400);
    } else {
      Logging.info("All fields present. Proceeding with the next steps...")
    }

    // Check if the user exist
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      Logging.warning("User already exist")
      return res.sendStatus(400)
    }

    // Create User
    const salt = random();

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    Logging.info("User Created")

    return res.status(200).json(user).end()
    //return res.status(200)

  } catch (error) {
    Logging.error(error)
    return res.sendStatus(400);
  }
}
