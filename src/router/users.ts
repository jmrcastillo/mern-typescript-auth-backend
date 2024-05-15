

import express from 'express';

import { getAllUsers, getSingleUsers,  deleteUser, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';


export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);
  router.get('/users/:id', isAuthenticated, isOwner, getSingleUsers);
  router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
  router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
};
