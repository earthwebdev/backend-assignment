import prisma from "../models/prismaclient.model.js";

export const getOrder = async (req, res) => {
    try {
        let queryObj = {...req.query};
        const removeQuery = ['select', 'sort', 'page', 'limit'];
        removeQuery.map((query) => {
            delete queryObj[query];
        });
        //console.log(typeof queryObj);

        const intvaluekey = ['amount'];
        for (const queryKey in queryObj) { 
            //console.log(queryKey, typeof queryObj[queryKey]); 
            if(queryKey === 'amount' ){
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
        queryObj.userId = req.user.id;
        const order = await prisma.order.findMany({
            where:  queryObj
        });
        const total = (order.length);
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
        
        const orderData = await prisma.order.findMany({
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
        //console.log(orderData);
        if(orderData.length > 0){
            return res.status(200).json({
                status: true,
                data: orderData,
                pagination,
                total,
                message: 'Order fetched successfully.'
            })
        }
        else{
            return res.status(400).json({
                status: false,            
                message: 'Order not found.'
            }) 
        }
    } catch (error) {
        return res.status(400).json({
            status: false,            
            message: error.message
        })
    }
}
export const createOrder = async (req, res) => {
  
    /* const bodyString = JSON.stringify(req.body);
    console.log(bodyString);
    
    const reqbody = JSON.parse(bodyString) ; */
    
    console.log(req.body);
    const userId = req.user.id;

    const {total} = req.body;
    if(!total){
        return res.status(400).json({
            status: false,            
            message: 'Please enter Order total amount.'
        })
    }
    const {payment} = req.body;
    console.log(payment);
    console.log(payment.amount);
    if(!payment || ! payment?.amount || !payment?.provider || !payment?.status){
        return res.status(400).json({
            status: false,            
            message: 'Please enter Order payments details.'
        })
    }
    
    const {items} = req.body;
    console.log(items);
    console.log(!items || !items[0].productId || !items[0].price || !items[0].quantity);
    if(!items || !items[0].productId || !items[0].price || !items[0].quantity){
        return res.status(400).json({
            status: false,            
            message: 'Please enter Order item details.'
        })
    }
    
    const order = await prisma.order.create({
        data: {
            userId: userId,
            total: parseFloat(req.body?.total),
        }
    });

    if(order){
        const orderId = order.id;
        const paymentDetails = await prisma.paymentDetails.create({
            data: {
                orderId,
                amount: parseFloat(payment?.amount),
                provider: payment?.provider,
                status: payment?.status,
            }
        });

        if(!paymentDetails){
            return res.status(400).json({
                status: false,            
                message: 'Order payment creation failed.'
            })
        }

        if(items.length > 0){
            for(let i = 0; i < items.length;i++){
                const orderItems = await prisma.OrderItems.create({
                    data: {
                        orderId,
                        productId: Number(items[i]?.productId),                
                        price: parseFloat(items[i]?.price),
                        quantity: Number(items[i]?.quantity),
                        total: parseFloat(items[i]?.total),
                        discountPercentage: parseFloat( items[i]?.discountPercentage ) ?? 0,
                        discountedPrice: parseFloat( items[i]?.discountedPrice ) ?? parseFloat(items[i]?.total),
                    }
                });

                if(!orderItems){
                    return res.status(400).json({
                        status: false,            
                        message: 'Order product creation failed.'
                    })
                }
            }
        }        

        

        return res.status(200).json({
            status: true,            
            data: order,
            message: 'Order creation successfully.'
        })

    } else{
        return res.status(400).json({
            status: false,            
            message: 'Order creation failed.'
        })
    }

}