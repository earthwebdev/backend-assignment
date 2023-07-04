import prisma from '../models/prismaclient.model.js';
export const registerUsers = async(req, res) => {
    try {
        console.log(req.body);
        const { fullname, age, phone, gender, address, email, password } = req.body
        const user = await prisma.user.create({
            data: {
                fullname,
                age,
                phone,
                gender,
                address,
                email,
                password,
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