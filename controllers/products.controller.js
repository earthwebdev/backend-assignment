import cloudinary from '../config/cloudinary.config.js';
import cloudinaryPhotos from '../config/cloudinary.config.js';
import prisma from '../models/prismaclient.model.js';
import fs from 'fs';
export const createProduct = async (req, res) => {
    try {                   
        //console.log(req.files.photos.length);
        //console.log(req.files, req.body, req.files.thumbnail[0].path, req.files.photos);
        /* if(req.files.photos.length > 0){
            //console.log(    req.files);
            for(let i = 0; i < req.files.photos.length; i++){
                console.log(req.files.photos[i].path);
            }
        }return; */ 
        const { title, description, price, discountPercentage, stock, brand, category } = req.body;               
        if (!req?.files.thumbnail[0]) {
            return res.status(400).json({
                status: false,
                message: 'Please upload image file only.'
            });
        }

        console.log(req.files.thumbnail[0].path);
        const thumbnailPath = req.files.thumbnail[0].path;
        //const cloudinaryData = await cloudinary.v2.uploader.upload(req.file.path, {folder: 'thumbnail'});
        let cloudinaryData = await cloudinary.v2.uploader.upload(thumbnailPath, {folder: 'thumbnail'});
        //console.log(cloudinaryData);
        const secure_url = cloudinaryData.secure_url;
        const public_id = cloudinaryData.public_id;                    


        const data = {
            title, description, price, discountPercentage, stock, brand, category, thumbnail: secure_url, thumbnail_public_id: public_id
        }
        
        const product = await prisma.product.create({
            data:{
                title, description,price: Number(price), discountPercentage: Number(discountPercentage), stock: Number(stock), brand, category, thumbnail: secure_url/* , thumbnail_public_id: public_id */
            }
        });
        if(cloudinaryData){
            cloudinaryData = {};
            fs.unlink(req.file.path, function(err) {
                if (err) {
                    console.log(err);
                }
                //console.log("File deleted successfully!");
             });
        }         
               
        if(product){
            if(req.files.photos.length > 0){
               // console.log(    req.files.photos.length);
                for(let i = 0; i < req.files.photos.length; i++){
                    //console.log(req.files[i].path, req.files[i]);
                    const photoPath = req.files.photos[i].path;
                    console.log(photoPath);
                    const cloudinaryPhotoData = await cloudinaryPhotos.v2.uploader.upload(photoPath, {folder: 'photos'});
                    console.log(cloudinaryPhotoData);
                    const width = cloudinaryPhotoData.width;
                    const height = cloudinaryPhotoData.height;
                    const url = cloudinaryPhotoData.secure_url;
                    const public_id = cloudinaryPhotoData.public_id;
                    const productId = product.id;
                    //public_id,
                    const photo = await prisma.photo.create({
                        data:{
                            width, height, url,  productId
                        }
                    });
    
                    fs.unlink(req.files.photos[i].path, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        //console.log("File deleted successfully!");
                     });
                }
            }
            
            return res.status(200).json({
                status: true,
                data: product,
                message: "Product created successfully."
            })
        } else {
            return res.status(400).json({
                status: false,
                message: "Product creation failed",
            });         
        }                                                
        //thumbnail
        
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message,
        });
    }
}