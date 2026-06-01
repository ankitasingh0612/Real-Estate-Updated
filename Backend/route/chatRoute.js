import express from 'express';
import { messageModel, userModel } from '../model/table.js';

const chatRoute = express.Router();

chatRoute.post('/send-message', async (req, res) => {
    try {
        const { senderId, receiverId, propertyId, message } = req.body;
        const mongoose = (await import('mongoose')).default;

        // Resolve Roles
        const getRole = async (id) => {
            if (id === 'admin') return 'admin';
            if (mongoose.Types.ObjectId.isValid(id)) {
                const u = await userModel.findById(id);
                return u ? u.userType : 'user';
            }
            return 'user';
        };

        const senderRole = await getRole(senderId);
        const receiverRole = await getRole(receiverId);

        // --- Role-Based Messaging Permissions ---
        if (senderRole === 'user' && receiverRole === 'admin') {
            // Check if it's a support chat OR if Admin initiated
            if (propertyId !== 'support') {
                const adminMsg = await messageModel.findOne({
                    senderId: 'admin',
                    receiverId: senderId,
                    propertyId: propertyId
                });
                if (!adminMsg) {
                    return res.json({ code: 403, message: "Buyers cannot initiate messages to Admin for properties." });
                }
            }
        }

        const newMsg = new messageModel({ 
            senderId, 
            senderRole,
            receiverId, 
            receiverRole,
            propertyId, 
            message 
        });
        await newMsg.save();

        res.json({
            code: 200,
            message: "Message sent",
            data: newMsg
        });
    } catch (error) {
        console.error("Chat Send Error:", error);
        res.json({ code: 500, message: "Internal server error" });
    }
});

chatRoute.post('/chat-history', async (req, res) => {
    try {
        const { userId, otherId, propertyId } = req.body;
        const mongoose = (await import('mongoose')).default;
        
        let userIds = [userId];
        if (mongoose.Types.ObjectId.isValid(userId)) {
            const user = await userModel.findById(userId);
            if (user && user.userType === 'admin') userIds.push('admin');
        }

        let otherIds = [otherId];
        if (mongoose.Types.ObjectId.isValid(otherId)) {
            const other = await userModel.findById(otherId);
            if (other && other.userType === 'admin') otherIds.push('admin');
        }
        
        let filter = {
            $or: [
                { senderId: { $in: userIds }, receiverId: { $in: otherIds } },
                { senderId: { $in: otherIds }, receiverId: { $in: userIds } }
            ]
        };

        if (propertyId) {
            filter.propertyId = propertyId;
        }

        const history = await messageModel.find(filter).sort({ createdAt: 1 });
        res.json({
            code: 200,
            message: "Success",
            data: history
        });
    } catch (error) {
        res.json({ code: 500, message: "Internal server error" });
    }
});

chatRoute.get('/my-conversations/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const mongoose = (await import('mongoose')).default;

        let searchIds = [userId];
        if (mongoose.Types.ObjectId.isValid(userId)) {
            const user = await userModel.findById(userId);
            if (user && user.userType === 'admin') {
                searchIds.push('admin');
            }
        }

        // Find all messages where any of searchIds is involved
        const messages = await messageModel.find({
            $or: [{ senderId: { $in: searchIds } }, { receiverId: { $in: searchIds } }]
        }).sort({ createdAt: -1 });

        // Group by conversation partner and property
        const convosMap = {};
        for (const msg of messages) {
            const isMe = searchIds.includes(msg.senderId);
            const partnerId = isMe ? msg.receiverId : msg.senderId;
            const key = `${partnerId}_${msg.propertyId}`;
            
            if (!convosMap[key]) {
                let partnerName = "Platform Admin";
                let partnerRole = "admin";

                if (partnerId !== 'admin') {
                    const partner = await userModel.findById(partnerId);
                    if (partner) {
                        partnerName = partner.name;
                        partnerRole = partner.userType;
                    }
                }

                convosMap[key] = {
                    partnerId: partnerId,
                    partnerName: partnerName,
                    partnerRole: partnerRole,
                    propertyId: msg.propertyId,
                    lastMessage: msg.message,
                    timestamp: msg.createdAt,
                    unreadCount: (!msg.isRead && searchIds.includes(msg.receiverId)) ? 1 : 0
                };
            } else if (!msg.isRead && searchIds.includes(msg.receiverId)) {
                convosMap[key].unreadCount++;
            }
        }

        const conversations = Object.values(convosMap);

        res.json({
            code: 200,
            message: "Success",
            data: conversations
        });
    } catch (error) {
        res.json({ code: 500, message: "Internal server error" });
    }
});

// Mark messages as read
chatRoute.post('/mark-read', async (req, res) => {
    try {
        const { senderId, receiverId, propertyId } = req.body;
        const mongoose = (await import('mongoose')).default;
        
        let receiverIds = [receiverId];
        if (mongoose.Types.ObjectId.isValid(receiverId)) {
            const user = await userModel.findById(receiverId);
            if (user && user.userType === 'admin') {
                receiverIds.push('admin');
            }
        }

        await messageModel.updateMany({
            senderId: senderId,
            receiverId: { $in: receiverIds },
            propertyId: propertyId,
            isRead: false
        }, {
            $set: { isRead: true }
        });
        res.json({ code: 200, message: "Marked read" });
    } catch (error) {
        res.json({ code: 500, message: "Error" });
    }
});

export default chatRoute;
