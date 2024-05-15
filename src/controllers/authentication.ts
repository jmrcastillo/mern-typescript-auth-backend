import express from 'express';

import { getUserByEmail, createUser } from '../db/users';
import { random, authentication } from '../helpers';


// Login Controller
export const login = async (req: express.Request, res: express.Response) => {

  try {
    const { email, password } = req.body;
    // Check if there is an email and password
    if (!email || !password) {
      console.log("Please Enter Your Email and Password")
      return res.sendStatus(400)
    }

    // user - to access authentication and salt
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user) {
      return res.sendStatus(400);
    }

    // Hash
    const expectedHash = authentication(user.authentication.salt, password);

    // Check if password is not equal to hash
    if (user.authentication.password != expectedHash) {
      console.log("Invalid Hash")
      return res.sendStatus(403);
    }

    // Update Session Token
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    // Set Cookie
    res.cookie('JM-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).json(user).end();

  } catch (error) {
    console.log(error)
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
      console.log("ONe or more fields are missing. Sending 400 status...")
      return res.sendStatus(400);
    } else {
      console.log("All fields present. Proceeding with the next steps...")
    }

    // Check if the user exist
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      console.log("User already exist")
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
    console.log("User Created")
    console.log(user)

    return res.status(200).json(user).end()
    //return res.status(200)

  } catch (error) {
    console.log("Jibreel Error")
    console.log(error)
    return res.sendStatus(400);
  }
}
