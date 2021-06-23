import { NextFunction, Request, Response } from "express";


function authenticate(req: Request, res: Response, next: NextFunction) {
    
    if (req.url.includes('admin')) {
        console.log("accepted value for auth header:", process.env.AUTH, "req.headers['auth']:", req.headers['auth']);

        if (!req.headers['auth'] || req.headers['auth'] != process.env.AUTH) {
            res.send('Unauthorized');
            return;
        }
    }

    next();
}

export default authenticate;