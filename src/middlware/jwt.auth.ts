import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import jsonwebtoken, { VerifyErrors} from "jsonwebtoken";

export default async function verify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization) {

    return res.status(httpStatus.UNAUTHORIZED).json({
      status: false,
      message: "Unauthorized",
    });
  }

  const bearer = authorization.split(" ");

  if (bearer[0] !== "Bearer") {

    return res.status(httpStatus.UNAUTHORIZED).json({
      status: false,
      message: "Unauthorized",
    });
  }

  const token = bearer[1];

  jsonwebtoken.verify(token, process.env.JWT_SECRET!, (err: VerifyErrors | null, user: any) => {
    if (err) {

      return res.status(httpStatus.UNAUTHORIZED).json({
        status: false,
        message: "Unauthorized",
      });
    }
    // Token is verified successfully
 else{
  
  res.locals.user = user; // Store user information in locals for later use
  res.set("userId", user.userId);
  res.set("user", JSON.stringify(user));
  res.set("role", user.role);

  next();
 }
  });
}
