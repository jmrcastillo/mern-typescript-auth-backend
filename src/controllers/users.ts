

import express from 'express';


import { deleteUserById, getUsers, getUserById } from '../models/users';


// Get all User
export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    console.log("Get All Users")
    const users = await getUsers();

    return res.status(200).json(users);

  } catch (error) {
    console.log(error)
    return res.sendStatus(400);
  }
}


// Get Single User
export const getSingleUsers = async (req: express.Request, res: express.Response) => {
  try {
    console.log("Get Single Users")
    const { id } = req.params;
    const user = await getUserById(id);

    return res.status(200).json(user).end();

  } catch (error) {
    console.log(error)
    return res.sendStatus(400);
  }
}


// Update User
export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      console.log("No Username")
      return res.sendStatus(403);
    }

    const user = await getUserById(id);

    user.username = username;
    await user.save()

    return res.status(200).json(user).end();

  } catch (error) {
    console.log(error)
    return res.sendStatus(400);
  }
}


// Delete User
export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.status(200).json(deletedUser);

  } catch (error) {
    console.log(error)
    return res.sendStatus(400);
  }
}
