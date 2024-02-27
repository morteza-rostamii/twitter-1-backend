import { COOKIE_JWT } from '@src/consts/const';
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

function authGuardMid(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
  const JWT_SECRET = process.env.JWT_SECRET || '';

  if (token) {

    // verify the token
    jwt.verify(
      token,
      JWT_SECRET,
      (error: any, decodedToken: any) => {
        if (error) {
          // shit token

          // clear old cookie
          res.clearCookie(COOKIE_JWT);

          return res.status(401).json({
            status: false,
            message: 'Unauthorized, bad token',
          });
        }
        else {
          // set user payload on req
          (req as any).user = decodedToken;
          next();
        }
      }
    )
  }
  else {
    return res.status(401).json({
      status: false,
      message: 'Unauthorized',
    });
  }
}

export default authGuardMid