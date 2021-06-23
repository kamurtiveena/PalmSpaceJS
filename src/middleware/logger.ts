import { NextFunction, Request, Response } from "express";


function log(req: Request, res: Response, next: NextFunction) {
    console.table({
        "method": req.method, 
        "protocol": req.protocol, 
        "hostname": req.hostname, 
        "ip": req.ip, 
        "base_url:": req.baseUrl, 
        "url:": req.url, 
        "path:": req.path, 
        "params:": req.params,
    });
    
    console.table(req.headers);

    console.log("body:", req.body);

    next();
}

export default log;