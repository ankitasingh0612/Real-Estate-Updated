import express from 'express';
import { propertyModel, userModel, buyerModel, ContactModel, visitModel, announcementQueueModel } from '../model/table.js'
import { triggerNewPropertyAlert } from './notificationRoute.js';
const adminRoute = express.Router();
adminRoute.post('/add-property', async (req, res) => {
    try {
        const { title, price, area, bhk, description, location, sellerId, sellerName } = req.body;
        const { pic } = req.files;
        pic.mv("uploads/" + pic?.name, (err) => {
            if (err) {
                res.json({
                    code: 400,
                    message: "Error in File Upload.",
                    data: ''
                })
            }
        })
        const isExist = await propertyModel.findOne({ title });
        if (isExist) {
            res.json({
                code: 400,
                message: "Property Already Exist.",
                data: isExist
            })
        } else {

            const data = new propertyModel({ title, price, area, bhk, description, location, pic: pic?.name, sellerId: sellerId || 'admin', sellerName: sellerName || 'Admin' })
            const result = await data.save();

            // Queue for announcement instead of immediate trigger
            await new announcementQueueModel({
                propertyId: result._id,
                propertyTitle: result.title,
                action: 'Added'
            }).save();

            res.json({
                code: 200,
                message: "Property Added Successfully..",
                data: result
            })
        }
    } catch (err) {
        res.json({
            code: 500,
            message: "Internal Server Error.",
            data: ''
        })
    }


})

adminRoute.get('/seller-properties/:id', async (req, res) => {
    try {
        const result = await propertyModel.find({ sellerId: req.params.id });
        if (result?.length > 0) {
            res.json({
                code: 200,
                message: "Data fetched successfully..",
                data: result
            })
        } else {
            res.json({
                code: 400,
                message: "Data Not Found.",
                data: []
            })
        }
    } catch (error) {
        res.json({
            code: 500,
            message: "Internal Server Error",
            data: ''
        })
    }
})

const dashboardStatsHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        let propertyFilter = {};
        let visitFilter = {};

        if (userId && userId !== 'admin') {
            propertyFilter = { sellerId: userId };
            const sellerProps = await propertyModel.find({ sellerId: userId }).select('_id');
            const propIds = sellerProps.map(p => p._id.toString());
            visitFilter = { propertyId: { $in: propIds } };
        }

        const totalProperties = await propertyModel.countDocuments(propertyFilter);
        const totalVisits = await visitModel.countDocuments(visitFilter);
        const totalBought = await buyerModel.countDocuments(); // Assume sold 
        const totalUsers = await userModel.countDocuments({ userType: 'user' });

        // Fetch Unread Conversations Count
        const { messageModel } = await import('../model/table.js');
        let searchIds = [userId || 'admin'];
        if (userId && userId !== 'admin') {
            searchIds = [userId];
        } else {
            searchIds = ['admin'];
        }
        
        const unreadMessages = await messageModel.find({
            receiverId: { $in: searchIds },
            isRead: false
        });
        
        // Group by partner and property to get conversation count
        const unreadConvos = new Set();
        unreadMessages.forEach(msg => {
            unreadConvos.add(`${msg.senderId}_${msg.propertyId}`);
        });

        res.json({
            code: 200,
            data: {
                totalProperties,
                totalVisits,
                totalBought,
                totalUsers,
                unreadConversations: unreadConvos.size
            }
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.json({ code: 500, message: "Error fetching stats" });
    }
};

adminRoute.get('/dashboard-stats', dashboardStatsHandler);
adminRoute.get('/dashboard-stats/:userId', dashboardStatsHandler);

adminRoute.get('/property-list', async (req, res) => {
    try {
        const result = await propertyModel.find();
        if (result) {
            res.json({
                code: 200,
                message: "Data fetched successfully..",
                data: result
            })
        } else {
            res.json({
                code: 400,
                message: "Data Not Found.",
                data: []
            })
        }
    } catch (err) {
        console.error("Error in property-list:", err);
        const isTimeout = err.message.includes('buffering timed out') || err.name === 'MongooseServerSelectionError';
        res.json({
            code: 500,
            message: isTimeout 
                ? "Database connection timeout. Please check if your database is reachable and IP is whitelisted." 
                : "Internal Server Error: " + err.message,
            data: []
        })
    }
})
adminRoute.get('/admin-sold-list', async (req, res) => {
    try {

        const raw = await buyerModel.find();
        const finalData = await Promise.all(
            raw?.map(async (item) => {
                const propertyData = await propertyModel.findOne({ _id: item?.propertyId });
                const userData = await userModel.findOne({ _id: item?.userId });
                return {
                    _id: item?._id,
                    propertyId: propertyData?._id,
                    title: propertyData?.title,
                    price: propertyData?.price,
                    area: propertyData?.area,
                    location: propertyData?.location,
                    description: propertyData?.description,
                    pic: propertyData?.pic,
                    name: userData?.name,
                    email: userData?.email,
                    contact: userData?.contact
                }
            })
        )
        res.json({
            code: 200,
            message: "Data fetched successfully.",
            data: finalData
        })
    } catch (err) {
        res.json({
            code: 500,
            message: "Internal Server Error",
            data: ''
        })
    }
})
adminRoute.post('/delete-property', async (req, res) => {
    try {
        const { _id } = req.body;
        const property = await propertyModel.findById(_id);
        const result = await propertyModel.findByIdAndDelete({ _id });
        if (result) {
            // Queue for announcement
            await new announcementQueueModel({
                propertyId: _id,
                propertyTitle: property?.title || "Unknown Property",
                action: 'Deleted'
            }).save();

            res.json({
                code: 200,
                message: "Property Deleted Successfully.",
                data: ''
            })
        } else {
            res.json({
                code: 400,
                message: "Property Deleted failed.",
                data: ''
            })
        }

    } catch (err) {
        res.json({
            code: 500,
            message: "Internal server Error.",
            data: ''
        })
    }
})
adminRoute.post('/delete-sold-item', async (req, res) => {
    try {
        const { _id } = req.body;
        const result = await buyerModel.findByIdAndDelete({ _id });
        if (result) {
            res.json({
                code: 200,
                message: "Property Deleted Successfully.",
                data: ''
            })
        } else {
            res.json({
                code: 400,
                message: "Property Deleted failed.",
                data: ''
            })
        }

    } catch (err) {
        res.json({
            code: 500,
            message: "Internal server Error.",
            data: ''
        })
    }
})
adminRoute.get('/admin-user-list', async (req, res) => {
    try {
        const result = await userModel.find({userType:"user"});
        if (result?.length > 0) {
            res.json({
                code: 200,
                message: "Data fetched successfully..",
                data: result
            })
        } else {
            res.json({
                code: 400,
                message: "Data Not Found.",
                data: []
            })
        }
    } catch (err) {
        res.json({
            code: 500,
            message: "Internal Server Error.",
            data: []
        })
    }
})
adminRoute.post('/contact-us-list', async (req, res) => {
    try {
        const data = await ContactModel.find();
        
        res.json({
            code: 200,
            message: "Data fetched successfully",
            data: data
        })

    } catch (err) {
        res.json({
            code: 500,
            message: "Internal Server Error.",
            data: []
        })
    }

})
adminRoute.post('/contact-us',async(req,res)=>{
   const {name,email,phone,subject,message}=req.body; 
   const data=new ContactModel({name,email,phone,subject,message});
    const result=await data.save();
    if(result){
      res.json({
         code:200,
         message:"Save successfully.",
         data:result
      })
    }else{
      res.json({
         code:400,
         message:"Save failed!.",
         data:''
      })
    }
})

// --- Admin Visit Management ---
adminRoute.get('/admin-visits', async (req, res) => {
    try {
        const { userId, userType } = req.query;
        let filter = {};

        if (userId && userType === 'seller') {
            // Find all properties belonging to this seller
            const sellerProps = await propertyModel.find({ sellerId: userId }).select('_id');
            const propIds = sellerProps.map(p => p._id.toString());
            filter = { propertyId: { $in: propIds } };
        }

        const visits = await visitModel.find(filter).sort({ createdAt: -1 });
        res.json({
            code: 200,
            message: "Visits fetched.",
            data: visits
        })
    } catch (err) {
        console.error("Error fetching visits:", err);
        res.json({
            code: 500,
            message: "Internal Server Error.",
            data: []
        })
    }
})

adminRoute.post('/update-visit-status', async (req, res) => {
    try {
        const { _id, status } = req.body;
        const result = await visitModel.findByIdAndUpdate(_id, { status }, { new: true });
        if (result) {
            res.json({
                code: 200,
                message: `Visit ${status} successfully.`,
                data: result
            })
        } else {
            res.json({
                code: 400,
                message: "Update failed.",
                data: ''
            })
        }
    } catch (err) {
        res.json({
            code: 500,
            message: "Internal Server Error.",
            data: ''
        })
    }
})

export default adminRoute;