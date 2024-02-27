import { Request, Response } from "express";
import User from "@src/modules/user/UserModel";
import speakeasy from 'speakeasy'
import Otp from '@src/modules/otp/otpModel'
import otpGenerator from 'otp-generator'
import jwt from 'jsonwebtoken'
import { COOKIE_JWT } from "@src/consts/const";

const authController = {

  // POST: /api/auth/register ------------------------------------------**

  async register(req: Request, res: Response) {
    const {username, email} = req.body;

    console.log(username, email);
    if (!username || !email) {
      return res.status(400).json({
        status: false,
        message: 'missing data.',
      });
    }

    try {
      // generate otp
      let new_otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      // check if otp not duplicated between multiple users
      let user_otp = await Otp.findOne({otp: new_otp});
      while (user_otp) {
        new_otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        user_otp = await Otp.findOne({otp: new_otp});
      }

      //save otp in db
      const createdOtp = await Otp.create({
        email,
        otp: new_otp,
      });

      //console.log('otp', new_otp);
      //return res.json({otp: createdOtp});
      const oldUser = await User.findOne({
        email: email,
      });

      if (oldUser) {
        // send otp for login

        return res.status(200).json({
          status: true,
          message: 'user already exists.',
          results: {
            otp: createdOtp,
          }
        });
      }

      // create a new user
      const user = new User({
        username: username,
        email: email,
      });
      await user.save();

      // send otp

      return res.status(200).json({
        status: true,
        message: 'registered successfully.',
        results: {
          user: user,
          otp: createdOtp,
        },
      });
    }
    catch(error: any) {
      return res.json({
        status: false,
        error: error?.message || error,
      });
    }
  },
  
  // POST: /api/auth/login ------------------------------------------**

  async login(req: Request, res: Response) {
    const {otp, email} = req.body;
    const jwtSecret = process.env.JWT_SECRET || '';

    
    if (!otp || !email) {
      return res.status(200).json({
        status: false,
        message: 'missing data.'
      });
    }
    console.log(otp, email);
    try {
      // verify the otp 

      // find the most recent otp
      const otps: any[] = await Otp.find({
        email,
      })
      .sort({createdAt: -1})
      .limit(1);

      // no otp or otp !== req.otp
      if (otps.length === 0 || otp !== otps[0].otp) {
        return res.status(200).json({
          status: false,
          message: 'the otp is not valid.'
        });
      }

      // if: valid =: generate jwt and set it on cookie

      // check if email is valid: valid email is stored in otp before upon user creation
      const user = await User.findOne({email});
      
      if (!user) return res.status(200).json({
        status: false,
        message: 'no such a user.'
      });

      const jwtPayload = {
        email: user?.email,
      };
      
      const token = jwt.sign(
        jwtPayload,
        jwtSecret,
        {expiresIn: '20h'}
      );

      // set cookies
      res.cookie(
        COOKIE_JWT,
        token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'development' ? false : true,
        }
      );
      
      return res.status(200).json({
        status: true,
        message: 'you are authenticated.',
        results: {
          user: user,
        },
      });
    }
    catch(error: any) {
      return res.status(500).json({
        status: false,
        error: error?.message || error,
      });
    }
  },

  // POST: /api/auth/check-auth ------------------------------------------**

  async checkAuth(req: Request, res: Response) {
    const token = req.cookies.jwt;
    const JWT_SECRET = process.env.JWT_SECRET || '';
  
    if (token) {
  
      // verify the token
      jwt.verify(
        token,
        JWT_SECRET,
        async (error: any, decodedToken: any) => {
          if (error) {
            // shit token
            return res.status(200).json({
              status: false,
              message: 'Unauthorized, bad token',
              results: {
                user: null,
              },
            });
          }
          else {
            // set user payload on req
            const {email} = decodedToken;
            const user = await User.findOne({email});

            return res.status(200).json({
              status: true,
              results: {
                user: user,
              },
            })
          }
        }
      )
    }
    else {
      return res.status(200).json({
        status: false,
        message: 'Unauthorized',
        results: {
          user: null,
        },
      });
    }
  }
}

export default authController;