import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  contact: { type: String },
  address: { type: String },
  profile: { type: String },
  userType: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const userModel = mongoose.model('users', userSchema);

const propertySchema = new mongoose.Schema({
  title: { type: String },
  price: { type: String },
  area: { type: String },
  bhk: { type: String },
  description: { type: String },
  location: { type: String },
  pic: { type: String },
  sellerId: { type: String, default: 'admin' },
  sellerName: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const propertyModel = mongoose.model('properties', propertySchema);


const BuyerSchema = new mongoose.Schema({
  userId: { type: String },
  propertyId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})
export const buyerModel = mongoose.model('buyers', BuyerSchema)

const ContactSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  subject: { type: String },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export const ContactModel = mongoose.model('contacts', ContactSchema)

const WishlistSchema = new mongoose.Schema({
  userId: { type: String },
  propertyId: { type: String },
  createdAt: { type: Date, default: Date.now },
})
export const wishlistModel = mongoose.model('wishlists', WishlistSchema)

const ReviewSchema = new mongoose.Schema({
  userId: { type: String },
  propertyId: { type: String },
  userName: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
})
export const reviewModel = mongoose.model('reviews', ReviewSchema)

const VisitSchema = new mongoose.Schema({
  userId: { type: String },
  propertyId: { type: String },
  propertyTitle: { type: String },
  userName: { type: String },
  userEmail: { type: String },
  userPhone: { type: String },
  visitDate: { type: String },
  visitTime: { type: String },
  message: { type: String },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
})
export const visitModel = mongoose.model('visits', VisitSchema)

const MessageSchema = new mongoose.Schema({
  senderId: { type: String },
  senderRole: { type: String, enum: ['user', 'seller', 'admin'] },
  receiverId: { type: String },
  receiverRole: { type: String, enum: ['user', 'seller', 'admin'] },
  propertyId: { type: String },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})
export const messageModel = mongoose.model('messages', MessageSchema)
 
 const NotificationSchema = new mongoose.Schema({
   userId: { type: String, required: true },
   title: { type: String, required: true },
   message: { type: String, required: true },
   type: { type: String, enum: ['NewProperty', 'PriceDrop', 'System'], default: 'System' },
   propertyId: { type: String },
   isRead: { type: Boolean, default: false },
   createdAt: { type: Date, default: Date.now }
 })
 export const notificationModel = mongoose.model('notifications', NotificationSchema)
 
 const PreferenceSchema = new mongoose.Schema({
   userId: { type: String, required: true, unique: true },
   location: { type: String },
   minBudget: { type: Number, default: 0 },
   maxBudget: { type: Number, default: 999999999 },
   propertyType: { type: String, enum: ['All', 'Rent', 'Sale'], default: 'All' },
   emailNotifications: { type: Boolean, default: true },
   updatedAt: { type: Date, default: Date.now }
 })
 export const preferenceModel = mongoose.model('preferences', PreferenceSchema)

 const AnnouncementQueueSchema = new mongoose.Schema({
   propertyId: { type: String },
   propertyTitle: { type: String },
   action: { type: String, enum: ['Added', 'Deleted'] },
   createdAt: { type: Date, default: Date.now }
 });
 export const announcementQueueModel = mongoose.model('announcement_queue', AnnouncementQueueSchema);
