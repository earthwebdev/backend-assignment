import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        const token = req.headers.authorization.split(' ')[1];
        //console.log(token);
        const jwt_token = process.env.JWT_SECRET_KEY;
        const verfiyPwd = jwt.verify(token, jwt_token);
        if(verfiyPwd){
            //console.log(verfiyPwd);
            req.user = verfiyPwd;
            next();
        } else {
            return res.status(401).json({
                status: false,
                message: 'You are not authorized to access this resource.'
            });
        }
    }

}