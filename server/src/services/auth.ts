import type { Request } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = ({ req }: { req: Request} ) => {
  let token = req.body.token || req.query.token || req.headers.authorization;
  console.log("tokenBefore: ", token);
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }
  console.log("tokenAfter: ", token);
  if (token) {
    const secretKey = process.env.JWT_SECRET_KEY || '';

    try {
      const data: any = jwt.verify(token as string, secretKey, { maxAge: '1h' });
      console.log("dataAuth: ", data);
      req.user = data as JwtPayload;
      console.log("req.user: ", req.user);
    } catch (err) {
      console.log(err);
    }
    return req;
  } else {
    return req; // Unauthorized
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
