import { NextFunction, Request, Response } from "express";

const Authenticator = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if(!token)
        return res.status(401).send();
    
    if(token === "admin")
        return next();

    return res.status(401).send();   
}
export default Authenticator