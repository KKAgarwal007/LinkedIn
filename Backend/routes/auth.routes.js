import express, { Router } from 'express';
import { Login, LogOut, SignUp } from '../controllers/auth.controller.js';

const authRoute = express(Router());

authRoute.post("/signup",SignUp);
authRoute.post("/login",Login);
authRoute.get("/logout",LogOut)

export default authRoute;