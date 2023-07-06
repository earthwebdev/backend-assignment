import { types } from 'util';
import cloudinary from '../config/cloudinary.config.js';
import cloudinaryPhotos from '../config/cloudinary.config.js';
import prisma from '../models/prismaclient.model.js';
import fs from 'fs';

export const getProduct = async (req, res) => {
    try {
        let queryObj = {...req.query};
        const removeQuery = ['select', 'sort', 'page', 'limit'];
        removeQuery.map((query) => {
            delete queryObj[query];
        });
        //console.log(typeof queryObj);

        const intvaluekey = ['price', 'stock'];
        for (const queryKey in queryObj) { 
            //console.log(queryKey, typeof queryObj[queryKey]); 
            if(queryKey === 'price' || queryKey === 'stock'){
                let data;
                ///console.log(queryObj[queryKey] === 'object', queryObj[queryKey]);
                if(typeof queryObj[queryKey] === 'object'){
                    //const queryObjIns = queryObj[queryKey];
                    for (const key in queryObj[queryKey]) {
                        //console.log(key, 'fffff');
                        if (queryObj[queryKey].hasOwnProperty(key)) {
                            //console.log(queryObj[queryKey][key], 'sssss');
                            queryObj[queryKey][key] = Number(queryObj[queryKey][key]);
                        }
                    }
                }else{
                    queryObj[queryKey] = Number(queryObj[queryKey])
                }
            }
            //console.log(queryObj);        
        }
        const product = await prisma.product.findMany({
            where:  queryObj
        });
        const total = (product.length);
        const select = {};
        if(req.query?.select){
            const selectData = req.query.select.split(",");
            console.log(selectData);
            for(let i =0; i < selectData.length; i++){
                select[selectData[i]] = true;
            }
        }
        console.log(select);
        console.log(req.query?.sort);

        const sort = [];
        if(req.query?.sort){
            const sortData = req.query.sort.split(",");
            
            //console.log(sortData);
            for(let i =0; i < sortData.length; i++){
                const sortObj = {};
                const sortKey = sortData[i].split(".");
                //console.log(sortKey);
                sortObj[sortKey[0]] = sortKey[1];
                sort.push(sortObj);
            }
            
        } else {
            sort.push({createdAt: 'desc'});
        } 
        
        //pagination data
        const page = Number(req.query?.page) ?? 1;
        const limit = Number(req.query.limit) ?? 20;
        const offset = (page -1 ) * limit;
        const skipData = (page) * limit;

        const pagination = {};
        console.log(skipData, total, offset);
        if(skipData < total){
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(offset > 0){
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        
        const productData = await prisma.product.findMany({
            where:  queryObj,
            select,
            orderBy: sort,
            take: limit,
            skip: offset
        });
        /* include: {
            photos: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        }, */
        //console.log(productData);
        if(productData.length > 0){
            res.status(200).json({
                status: true,
                data: productData,
                pagination,
                total,
                message: 'Product fetched successfully.'
            })
        }
        else{
            res.status(400).json({
                status: false,            
                message: 'Product not found.'
            }) 
        }
    } catch (error) {
        res.status(400).json({
            status: false,            
            message: error.message
        })
    }
}
export const createProduct = async (req, res) => {
    try {                   
        //console.log(req.files.photos.length);
        //console.log(req.files, req.body, req.files.thumbnail[0].path, req.files.photos);        
        if (!req?.files.thumbnail[0]) {
            return res.status(400).json({
                status: false,
                message: 'Please upload image file only.'
            });
        }
        const { title, description, price, discountPercentage, stock, brand, category } = req.body;               
        

        if(!title || !description || !price || !stock || !brand || !category){
            return res.status(400).json({
                status: false,
                message: 'Please enter title, description, price, stock, brand and category.'
            });
        }

        //console.log(req.files.thumbnail[0].path);
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
            //cloudinaryData = {};
            fs.unlink(req.files.thumbnail[0].path, function(err) {
                if (err) {
                    console.log(err);
                }
                //console.log("File deleted successfully!");
             });
        }         
               
        if(product){
            if(req.files.photos.length > 0){
                console.log(    req.files.photos.length);
                for(let i = 0; i < req.files.photos.length; i++){
                    console.log(req.files.photos[i].path, req.files.photos[i]);
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
            message: error.message + 'waits dataa',
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await prisma.product.findUnique({
            where:{
                id: Number(id)
            }
        });

        if(!product){
            res.status(400).json({
                status: false,            
                message: 'Product not found.'
            })
        }

        /* if (!req?.files.thumbnail[0]) {
            return res.status(400).json({
                status: false,
                message: 'Please upload image file only.'
            });
        } */
        const { title, isThumbnailSubmitted = false, isPhotosSubmitted = false, description, price, discountPercentage, stock, brand, category } = req.body;
        if(!title || !description || !price || !stock || !brand || !category){
            return res.status(400).json({
                status: false,
                message: 'Please enter title, description, price, stock, brand and category.'
            });
        }
        let secure_url, public_id;
        if ( isThumbnailSubmitted && req?.files.thumbnail[0]) {
            const thumbnailPath = req.files.thumbnail[0].path;
            //const cloudinaryData = await cloudinary.v2.uploader.upload(req.file.path, {folder: 'thumbnail'});
            let cloudinaryData = await cloudinary.v2.uploader.upload(thumbnailPath, {folder: 'thumbnail'});
            //console.log(cloudinaryData);
            secure_url = cloudinaryData.secure_url;
            public_id = cloudinaryData.public_id; 

            if(product?.thumbnail_public_id){
                await cloudinary.v2.uploader.destroy(product.thumbnail_public_id);
            }
            if(cloudinaryData){
                //cloudinaryData = {};
                fs.unlink(req.files.thumbnail[0].path, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    //console.log("File deleted successfully!");
                 });
            }
        }else {
            secure_url = product.thumbnail;
            public_id = product.thumbnail_public_id;

        }
        
        const updateProduct = await prisma.product.update({
            where:{
                id: Number(id)
            },
            data:{
                title, description, price: Number(price), discountPercentage: Number(discountPercentage) ?? 0, stock: Number(stock), brand, category, thumbnail: secure_url, thumbnail_public_id: public_id
            },
        });
        if(updateProduct){
            if(isPhotosSubmitted && req.files.photos?.length > 0){
                console.log(    req.files.photos.length);
                for(let i = 0; i < req.files.photos.length; i++){
                    console.log(req.files.photos[i].path, req.files.photos[i]);
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

                if(photoSubmittedData.length > 0){
                    for(let y = 0; y < photoSubmittedData.length; y++){
                        const id = photoSubmittedData[i];
                        if(id){
                            const photoData = await prisma.photo.findUnique({
                                where:{
                                    id
                                }
                            });
                            if(photoData){
                                const photourl = photoData?.url;
                                const public_id = photoData?.public_id;

                                if(public_id){
                                    await cloudinary.v2.uploader.destroy(public_id);
                                }

                                await prisma.photo.delete({
                                    where:{
                                        id: photoData.id
                                    }
                                });
                            }
                        }
                    }
                }

            }
            
            return res.status(200).json({
                status: true,
                data: updateProduct,
                message: "Product updated successfully."
            })
        } else {
            return res.status(400).json({
                status: false,
                message: "Product updated failed",
            });         
        }
        

    } catch (error) {
        res.status(400).json({
            status: false,            
            message: error.message
        })
    }
    
}

export const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        //console.log(id);
        const product = await prisma.product.findUnique({
            where:{
                id: Number(id)
            }
        });
        //console.log(product);
        if(product){
            const photos = await prisma.photo.findMany({
                where:{
                    productId: Number(id)
                }
            });
            //console.log(photos);
            if(photos.length > 0){
                for(let photo of photos){
                    const photourl = photo.url;
                    const public_id = photo?.public_id;

                    if(public_id){
                        await cloudinary.v2.uploader.destroy(public_id);
                    }

                    const photos = await prisma.photo.delete({
                        where:{
                            id: photo.id
                        }
                    });
                }
            }
            if(product.thumbnail_public_id){
                await cloudinary.v2.uploader.destroy(product.thumbnail_public_id);
            }
            
            
            await prisma.product.delete({
                where: {
                id: product.id,
                },
            })
            return res.status(200).json({
                status: true,                
                message: "Product deleted successfully."
            })
        }
    } catch (error) {
        return res.status(200).json({
            status: false,            
            message: error.message
        })
    }
}