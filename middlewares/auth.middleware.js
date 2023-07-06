import jwt from 'jsonwebtoken';
import prisma from '../models/prismaclient.model.js';

export const authMiddleware = async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1];
        //console.log(token);
        const jwt_token = process.env.JWT_SECRET_KEY;
        try {
            jwt.verify(token, jwt_token, (err, decode) => {
                if (err) { 
                    return res.status(401).json({ staus:false, message: err.message}); 
                }
                req.user = decode; 
                return next(); 
            })
        } catch (error) {
            return res.status(401).json({
                status: false,
                message: error.message
            });
        }
        /* const verfiyPwd = jwt.verify(token, jwt_token);
        if(verfiyPwd){
            //console.log(verfiyPwd);
            req.user = verfiyPwd;
            next();
        } else {
            return res.status(401).json({
                status: false,
                message: 'You are not authorized to access this resource.'
            });
        } */
    }
}

export const authorize = (...roles) => async (req, res, next) => {
    const { id }= req.user;
    const user = await prisma.user.findUnique({
        where:{
            id
        },
        select: {
            role: true,
        }
    });
    const role = user.role;   
    //console.log(role, roles); 
    if(!roles.includes(role)){
        return res.status(401).json({
            status: false,
            message: 'You are not authorized to access this resource.'
        });
    }

    next();
}