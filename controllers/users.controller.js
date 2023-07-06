import prisma from '../models/prismaclient.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const registerUsers = async(req, res) => {
    try {
        //console.log(req.body);
        const { fullname, age, phone, gender, address, email, password } = req.body;

        if(!fullname || !email || !password ){
            return res.status(400).json({
                status: false,
                message: "User must have fullname, email and password.",
            });
        }

        const existUser = await prisma.user.findUnique({
            where: {
              email,
            },
          })
          
        //console.log(existUser);
        if(existUser){
            return res.status(400).json({
                status: false,
                message: "User has already registed.",
            }); 
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        //password = hashPassword;
        const user = await prisma.user.create({
            data: {
                fullname,
                age,
                phone,
                gender,
                address,
                email,
                password: hashPassword,
            },
        });

        if(user){
            return res.status(200).json({
                status: true,
                data: user,
                message: "User created successfully."
            })
        } else {
            return res.status(400).json({
                status: false,
                message: "User creation failed",
            });        
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message,
        });
    }
}

export const loginUsers = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password ){
            return res.status(400).json({
                status: false,
                message: "Please enter email and password.",
            });
        }
        const existUser = await prisma.user.findUnique({
            where: {
              email,
            },
          })
          
        //console.log(existUser);
        if(!existUser){
            return res.status(400).json({
                status: false,
                message: "Please provide the correct email and password",
            }); 
        }

        const verfiyPassword = await bcrypt.compare(password, existUser.password);
        if(!verfiyPassword){
            return res.status(400).json({
                status: false,
                message: "Please provide the correct email and password",
            });
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({id: existUser.id},  secretKey, {expiresIn: '1d'});

        return res.status(200).json({
            status: true,
            data:{
                jwt_token: token,
                role: existUser.role,
            },
            
            message: 'Users login succcessfully.'
        })

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message,
        });
    }
}

export const profileUsers = async (req, res) => {
    try {
        const {id} = req.user;
        const existUser = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {            
                id: true,
                fullname: true,
                age: true,
                phone: true,
                gender: true,
                role: true,
                address: true,
                email: true,            
            },
        })
      
        //console.log(existUser);
        if(!existUser){
            return res.status(400).json({
                status: false,
                message: "User not found",
            }); 
        }

        return res.status(200).json({
            status: true,
            data: existUser,        
            message: 'User profile get succcessfully.'
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message,
        });
    }
}