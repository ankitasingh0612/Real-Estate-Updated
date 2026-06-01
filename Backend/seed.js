import mongoose from 'mongoose';
import { userModel, propertyModel, reviewModel, visitModel, buyerModel, ContactModel, wishlistModel, messageModel } from './model/table.js';

const MONGO_URI = 'mongodb+srv://akhils88815_db_user:OKr0qFbfEM5Bidx1@akhil.nl69xgn.mongodb.net/Quirex?retryWrites=true&w=majority&appName=Akhil';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("-----------------------------------------");
    console.log("✅ DB connected for rich seeding...");
    console.log("-----------------------------------------");

    // --- Cleanup collections (Preserve Admin) ---
    console.log("🧹 Cleaning up old data...");
    await propertyModel.deleteMany({});
    await reviewModel.deleteMany({});
    await visitModel.deleteMany({});
    await buyerModel.deleteMany({});
    await ContactModel.deleteMany({});
    await wishlistModel.deleteMany({});
    await messageModel.deleteMany({});
    // Remove all users except the root admin
    await userModel.deleteMany({ email: { $ne: 'admin@quirex.com' } });

    // --- Seed Admin if missing ---
    let admin = await userModel.findOne({ email: 'admin@quirex.com' });
    if (!admin) {
      admin = await userModel.create({
        name: 'Quirex Admin',
        email: 'admin@quirex.com',
        password: 'admin123',
        contact: '9999999999',
        address: 'Quirex HQ, New Delhi',
        profile: 'a.jpeg',
        userType: 'admin'
      });
      console.log("👤 Admin user restored.");
    }

    // --- Seed THE User (Akhil Singh) ---
    console.log("👤 Seeding PRIMARY Seller: Akhil Singh...");
    const akhilUser = await userModel.create({
      _id: new mongoose.Types.ObjectId("69d613d48382900a6e4ea874"),
      name: "Akhil Singh",
      email: "akhils88815@gmail.com",
      password: "afsar123",
      contact: "09076827270",
      address: "Koilgraha",
      profile: "car.jpg.jpg",
      userType: "seller"
    });

    // --- Seed Other Sellers ---
    console.log("👥 Seeding other sample Sellers...");
    const otherSellers = await userModel.insertMany([
      { name: 'Rajesh Malhotra', email: 'rajesh@seller.com', password: 'password123', contact: '9876543210', address: 'Bandra West, Mumbai', profile: 'b.jpeg', userType: 'seller' },
      { name: 'Priya Sharma', email: 'priya@seller.com', password: 'password123', contact: '9123456789', address: 'Indira Nagar, Bangalore', profile: 'c.jpeg', userType: 'seller' }
    ]);

    // --- Seed Buyers ---
    console.log("👥 Seeding sample Buyers...");
    const buyers = await userModel.insertMany([
      { name: 'Suresh Raina', email: 'suresh@buyer.com', password: 'password123', contact: '7770001112', address: 'Juhu, Mumbai', profile: 'e.jpeg', userType: 'user' },
      { name: 'Deepika Padukone', email: 'deepika@buyer.com', password: 'password123', contact: '6665554443', address: 'South Extension, Delhi', profile: 'f.jpeg', userType: 'user' },
      { name: 'Virat Kohli', email: 'virat@buyer.com', password: 'password123', contact: '1818181818', address: 'Worli, Mumbai', profile: 'g.jpeg', userType: 'user' }
    ]);

    // --- Seed Properties for Akhil Singh (10 Properties) ---
    console.log("🏠 Seeding 10 MASSIVE properties for Akhil Singh...");
    const akhilProperties = [
      { title: 'The Sky-High Penthouse', price: '85000', area: '4500', bhk: '4', location: 'Worli, Mumbai', pic: 'd.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'Breathtaking 270-degree Arabian Sea views from every room.' },
      { title: 'Zen Garden Villa', price: '45000', area: '3200', bhk: '5', location: 'Whitefield, Bangalore', pic: 'a.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'Modern architecture meets nature in this fully automated smart villa.' },
      { title: 'Sunset View Apartment', price: '22000', area: '1850', bhk: '3', location: 'Bandra, Mumbai', pic: 'b.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'Elegant 3BHK flat near the promenade with modern amenities.' },
      { title: 'Heritage Lane Cottage', price: '15000', area: '1400', bhk: '2', location: 'Civil Lines, Lucknow', pic: 'home.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'A piece of history refreshed with modern luxury. Wooden interiors.' },
      { title: 'Grand Courtyard House', price: '42000', area: '3800', bhk: '5', location: 'Anna Nagar, Chennai', pic: 'g.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'Tradition meets modernity in this sprawling 5BHK house.' },
      { title: 'Emerald Green Studio', price: '7500', area: '550', bhk: '1', location: 'Sector 62, Noida', pic: 'f.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'Compact, efficient, and located next to the IT hub.' },
      { title: 'Metro Central Residence', price: '26000', area: '1600', bhk: '3', location: 'Andheri East, Mumbai', pic: 'a.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'Minutes away from the metro, airport, and business centers.' },
      { title: 'The Vintage Haven', price: '21000', area: '2000', bhk: '3', location: 'Chandigarh Road, Chandigarh', pic: 'home.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'Spacious lawns and open-plan living areas for families.' },
      { title: 'Oakwood Terrace', price: '29000', area: '2400', bhk: '3', location: 'Pune Camp, Pune', pic: 'b.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'Quiet neighborhood, very spacious balcony, and top-tier security.' },
      { title: 'Glass House Mansion', price: '110000', area: '6000', bhk: '5', location: 'Jubilee Hills, Hyderabad', pic: 'g.jpeg', sellerId: akhilUser._id, sellerName: akhilUser.name, description: 'Ultimate luxury with a private theater, infinity pool, and gym.' }
    ];

    // --- Seed Properties for Other Sellers (10 more) ---
    console.log("🏠 Seeding 10 more properties for other sellers...");
    const otherProperties = [
      { title: 'Lakeside Bliss', price: '32000', area: '2100', bhk: '3', location: 'Nainital', pic: 'e.jpeg', sellerId: otherSellers[0]._id, sellerName: otherSellers[0].name, description: 'Cozy lakeside living.' },
      { title: 'Urban Chic Loft', price: '12000', area: '950', bhk: '1', location: 'Hauz Khas, Delhi', pic: 'c.jpeg', sellerId: otherSellers[1]._id, sellerName: otherSellers[1].name, description: 'Industrial design loft.' },
      { title: 'Riverside Retreat', price: '48000', area: '3500', bhk: '4', location: 'Rishikesh', pic: 'f.jpeg', sellerId: otherSellers[0]._id, sellerName: otherSellers[0].name, description: 'Serene riverside villa.' },
      { title: 'City Lights Flat', price: '18000', area: '1100', bhk: '2', location: 'Indira Nagar, Bangalore', pic: 'a.jpeg', sellerId: otherSellers[1]._id, sellerName: otherSellers[1].name, description: 'Modern flat in the heart of the city.' },
      { title: 'Mountain View Home', price: '25000', area: '2400', bhk: '3', location: 'Shimla', pic: 'd.jpeg', sellerId: otherSellers[0]._id, sellerName: otherSellers[0].name, description: 'Majestic mountain views.' },
      { title: 'Luxury Stay', price: '95000', area: '5000', bhk: '5', location: 'Goa', pic: 'g.jpeg', sellerId: otherSellers[1]._id, sellerName: otherSellers[1].name, description: 'Ultra-luxurious beach house.' },
      { title: 'Smart City Condo', price: '21000', area: '1300', bhk: '2', location: 'Cyber City, Gurgaon', pic: 'b.jpeg', sellerId: otherSellers[0]._id, sellerName: otherSellers[0].name, description: 'High-tech living.' },
      { title: 'The Quiet Corner', price: '16000', area: '1500', bhk: '2', location: 'Mysore', pic: 'home.jpeg', sellerId: otherSellers[1]._id, sellerName: otherSellers[1].name, description: 'Peaceful residential area.' },
      { title: 'Skyline View', price: '35000', area: '2800', bhk: '4', location: 'BKC, Mumbai', pic: 'a.jpeg', sellerId: otherSellers[0]._id, sellerName: otherSellers[0].name, description: 'Premium business district living.' },
      { title: 'Green Valley Villa', price: '42000', area: '3600', bhk: '4', location: 'Dehradun', pic: 'c.jpeg', sellerId: otherSellers[1]._id, sellerName: otherSellers[1].name, description: 'surrounded by nature.' }
    ];

    const allProperties = await propertyModel.insertMany([...akhilProperties, ...otherProperties]);
    
    // --- Seed Reviews ---
    console.log("⭐ Seeding dozens of Reviews...");
    const reviews = [];
    allProperties.forEach((p, index) => {
      reviews.push({
        userId: buyers[index % 3]._id, 
        propertyId: p._id, 
        userName: buyers[index % 3].name, 
        rating: 5 - (index % 2), 
        comment: index % 2 === 0 ? "Outstanding experience! The property was even better in person." : "Great interaction with the seller, very professional."
      });
      reviews.push({
        userId: buyers[(index + 1) % 3]._id, 
        propertyId: p._id, 
        userName: buyers[(index + 1) % 3].name, 
        rating: 4, 
        comment: "Excellent location and top-notch facilities."
      });
    });
    await reviewModel.insertMany(reviews);

    // --- Seed Visits for Akhil Singh (6 Visits) ---
    console.log("📅 Seeding 6 Visit Requests for Akhil Singh...");
    const akhilVisits = [];
    for (let i = 0; i < 6; i++) {
        const prop = allProperties[i]; // All first 6 relate to Akhil
        const buyer = buyers[i % 3];
        const statuses = ['Pending', 'Accepted', 'Completed'];
        akhilVisits.push({
            userId: buyer._id,
            propertyId: prop._id,
            propertyTitle: prop.title,
            userName: buyer.name,
            userEmail: buyer.email,
            userPhone: buyer.contact,
            visitDate: `2026-04-${15 + i}`,
            visitTime: `${10 + i}:00 AM`,
            message: `Looking forward to seeing this ${prop.bhk}BHK.`,
            status: statuses[i % 3]
        });
    }
    await visitModel.insertMany(akhilVisits);

    console.log("-----------------------------------------");
    console.log("🎉 SUCCESS: Akhil Singh's Dashboard is now FULL!");
    console.log(`📦 Your Properties: ${akhilProperties.length}`);
    console.log(`🏠 Total Platform Properties: ${allProperties.length}`);
    console.log(`📅 Your Visit Requests: ${akhilVisits.length}`);
    console.log(`⭐ Total Ratings: ${reviews.length}`);
    console.log("-----------------------------------------");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();

