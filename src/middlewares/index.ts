
import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';


export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {

    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string;

    if (!currentUserId) {
      console.log("No Existing ID")
      return res.sendStatus(403);
    }

    if (currentUserId.toString() != id) {
      console.log("Not Equal to ID")
      return res.sendStatus(403);
    }

    return next();

  } catch (error) {
    console.log(error)
    return res.sendStatus(400);
  }
}


export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {

    const sessionToken = req.cookies['JM-AUTH'];
    console.log("SessionToken")
    console.log(sessionToken)

    if (!sessionToken) {
      console.log("No sessionToken")
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    console.log("Existing User")
    console.log(existingUser)

    if (!existingUser) {
      console.log("Not an existing User")
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser })

    return next();

  } catch (error) {
    console.log(error)
    return res.sendStatus(400);
  }
}
