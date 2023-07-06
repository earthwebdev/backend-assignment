import prisma from "../models/prismaclient.model.js";
export const reporting = async (req, res) => {
    //console.log(req.originalUrl);
    const reportType = req.originalUrl.split('/').pop();
    
    console.log(reportType);
    try {
        if(reportType === 'days'){
            let today = new Date().toISOString().slice(0, 10)
            const date = new Date(today);
            console.log(date, new Date())
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                    // new Date() creates date with current time and day and etc.
                        gte: new Date(today)
                },
                },
                select:{
                                total: true
                    
                }
            });
            console.log(orders);
            let totalamount = 0;
            if(orders.length > 0){
    
                    for(let i=0; i < orders.length; i++){
                        totalamount += orders[i].total;
                    }
            }
            return res.status(200).json({
                status: true,
                data: totalamount,
                message: 'Reporting generated successfully by ' + reportType
            })
        } else if(reportType === 'weeks'){
            var curr = new Date();
            var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
            var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));

            let today = new Date().toISOString().slice(0, 10)
            const date = new Date(today);
            //console.log(date, firstday, lastday);return
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                    // new Date() creates date with current time and day and etc.
                        gte: firstday,
                        lte: lastday,
                },
                },
                select:{
                                total: true
                    
                }
            });
            console.log(orders);
            let totalamount = 0;
            if(orders.length > 0){
    
                    for(let i=0; i < orders.length; i++){
                        totalamount += orders[i].total;
                    }
            }
            return res.status(200).json({
                status: true,
                data: totalamount,
                message: 'Reporting generated successfully by ' + reportType
            })
        }else if(reportType === 'months'){

            // Get today's date
            const todayDates = new Date();
            console.log('Before: ', todayDates);
            // Get current month
            const month = todayDates.getMonth();
            // Set today's date back to previous month
            const oneMonthBefore = todayDates.setMonth(month - 1);
            // Print new date
            console.log('After: ', new Date(oneMonthBefore));
            
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {                    
                        gte: new Date(oneMonthBefore),
                        lte: todayDates,
                    },
                },
                select:{
                    total: true                    
                }
            });
            console.log(orders);
            let totalamount = 0;
            if(orders.length > 0){
    
                    for(let i=0; i < orders.length; i++){
                        totalamount += orders[i].total;
                    }
            }else{
                return res.status(400).json({
                    status: false,            
                    message: 'No reports found.'
                })
            }
            return res.status(200).json({
                status: true,
                data: totalamount,
                message: 'Reporting generated successfully by ' + reportType
            })
        } else if(reportType.startsWith('differencdate')){
            const startdate = req.query.startdate ? new Date(req.query.startdate): '';
            if(!startdate)
            {
                return res.status(400).json({
                    status: false,            
                    message: 'Please enter the startdate.'
                })
            }
            const enddate = req.query.enddate ? new Date(req.query.enddate): new Date();
            // Get today's date
            /* const todayDates = new Date();
            console.log('Before: ', todayDates);
            // Get current month
            const month = todayDates.getMonth();
            // Set today's date back to previous month
            const oneMonthBefore = todayDates.setMonth(month - 1);
            // Print new date
            console.log('After: ', new Date(oneMonthBefore)); */
            
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {                    
                        gt: startdate,
                        lt: enddate,
                    },
                },
                select:{
                    total: true                    
                }
            });
            console.log(orders);
            let totalamount = 0;
            if(orders.length > 0){
    
                    for(let i=0; i < orders.length; i++){
                        totalamount += orders[i].total;
                    }
            }else{
                return res.status(400).json({
                    status: false,            
                    message: 'No reports found.'
                })
            }
            return res.status(200).json({
                status: true,
                data: totalamount,
                message: 'Reporting generated successfully by differencdate' 
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: false,            
            message: error.message
        })
    }
    
      
}