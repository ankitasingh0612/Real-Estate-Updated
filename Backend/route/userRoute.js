import express from 'express';
import { userModel, propertyModel, buyerModel, wishlistModel, reviewModel, visitModel } from '../model/table.js';
const router = express.Router();
router.post('/user-register', async (req, res) => {
  try {
    const { name, email, password, contact, address, userType, adminPin } = req.body;
    
    // Check if profile picture is uploaded
    if (!req.files || !req.files.profile) {
      return res.status(400).json({
        code: 400,
        message: "Profile picture is required.",
        data: ''
      });
    }

    // Admin PIN verification
    if (userType === 'admin') {
      const VALID_ADMIN_PIN = "admin9076";
      if (adminPin !== VALID_ADMIN_PIN) {
        return res.status(400).json({
          code: 400,
          message: "Invalid Admin Security PIN.",
          data: ''
        });
      }
    }

    const { profile } = req.files;
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        code: 400,
        message: "User already exists.",
        data: isExist
      });
    }

    // Move file first, then save to DB
    profile.mv("uploads/" + profile?.name, async (err) => {
      if (err) {
        console.error("❌ File upload error:", err);
        return res.status(500).json({
          code: 400,
          message: "Error moving file to uploads branch. Please ensure the 'uploads' folder exists and is writable.",
          data: err.message
        });
      }

      try {
        const data = new userModel({ 
          name, email, password, contact, address, 
          userType: userType || 'user', 
          profile: profile?.name 
        });
        const result = await data.save();
        console.log("✅ User registered successfully:", result.email);
        res.status(200).json({
          code: 200,
          message: "User Registered Successfully...",
          data: result
        });
      } catch (dbErr) {
        console.error("❌ Database error during registration:", dbErr);
        // Specifically handle duplicate key errors or validation errors
        const message = dbErr.code === 11000 
          ? "This email is already registered." 
          : "Database Error: " + dbErr.message;
        
        res.status(400).json({
          code: 400,
          message: message,
          data: dbErr
        });
      }
    });

  } catch (err) {
    console.error("❌ Internal Server Error in registration:", err);
    res.status(500).json({
      code: 500,
      message: "Server Configuration Error: " + err.message,
      data: ''
    });
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email, contact, newPassword } = req.body;
    
    // Check if a user with that exact email and contact exists
    const user = await userModel.findOne({ email: email, contact: contact });
    
    if (!user) {
      return res.json({
        code: 404,
        message: "Details do not match our records.",
        data: null
      });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    res.json({
      code: 200,
      message: "Password reset successfully. You can now login.",
      data: null
    });

  } catch (error) {
    res.json({
      code: 500,
      message: "Internal Server Error",
      data: ''
    });
  }
});

router.put('/user-update',async(req,res)=>{
try{
   const { name, email, password, contact, address,userId } = req.body;
    const { profile } = req.files;
    profile.mv("uploads/"+profile?.name,(err)=>{
      if(err){
        res.json({
          code:400,
          message:"Error In File Upload"
        })
      }
    })
 const result= await  userModel.findByIdAndUpdate({_id:userId},{name,email,password,contact,address,profile:profile?.name},{new:true})
if(result){
  res.json({
    code:200,
    message:"User Updated Successfully.",
    data:result
  })
}else{
  res.json({
    code:400,
    message:"User Updated Failed.",
    data: ''
  })
}
}catch(err){
res.json({
  code:500,
  message:"Internal Server Error."
})
}
})
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    const isLogin = await userModel.findOne({ email, password });
    if (isLogin) {
      res.json({
        code: 200,
        message: "Login Successfully..",
        data: isLogin
      })
    } else {
      res.json({
        code: 400,
        message: "Invalid Credentials.",
        data: ""
      })
    }
  } catch (err) {
    res.json({
      code: 500,
      message: "Internal Server Error",
      data: ''
    })
  }

})
router.post('/buy', async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    const isSold = await buyerModel.findOne({ propertyId })
    if (isSold) {
      res.json({
        code: 400,
        message: "Property Already Sold.",
        data: isSold
      })
    } else {
      const data = new buyerModel({ userId, propertyId });
      const result = await data.save();
      res.json({
        code: 200,
        message: "Property Bought Successfully..",
        data: result
      })
    }
  } catch (err) {
    res.json({
      code: 500,
      message: "Internal Server Error",
      data: ''
    })
  }
})
router.post('/user-bought-list', async (req, res) => {
  try {
    const { userId } = req.body;
    const raw = await buyerModel.find({ userId });
    const finalData = await Promise.all(
      raw?.map(async (item) => {
        const propertyData = await propertyModel.findOne({ _id: item?.propertyId });

        return {
          _id: item?._id,
          propertyId: propertyData?._id,
          title: propertyData?.title,
          price: propertyData?.price,
          area: propertyData?.area,
          location: propertyData?.location,
          description: propertyData?.description,
          pic: propertyData?.pic
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

// --- Wishlist / Favorite APIs ---
router.post('/wishlist-toggle', async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    const existing = await wishlistModel.findOne({ userId, propertyId });
    if (existing) {
      await wishlistModel.findByIdAndDelete(existing._id);
      res.json({
        code: 200,
        message: "Removed from Wishlist.",
        data: { wishlisted: false }
      })
    } else {
      const data = new wishlistModel({ userId, propertyId });
      await data.save();
      res.json({
        code: 200,
        message: "Added to Wishlist!",
        data: { wishlisted: true }
      })
    }
  } catch (err) {
    res.json({
      code: 500,
      message: "Internal Server Error",
      data: ''
    })
  }
})

router.post('/user-wishlist', async (req, res) => {
  try {
    const { userId } = req.body;
    const raw = await wishlistModel.find({ userId });
    const finalData = await Promise.all(
      raw?.map(async (item) => {
        const propertyData = await propertyModel.findOne({ _id: item?.propertyId });
        return {
          _id: item?._id,
          propertyId: propertyData?._id,
          title: propertyData?.title,
          price: propertyData?.price,
          area: propertyData?.area,
          location: propertyData?.location,
          description: propertyData?.description,
          pic: propertyData?.pic
        }
      })
    )
    res.json({
      code: 200,
      message: "Wishlist fetched successfully.",
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

router.post('/user-wishlist-ids', async (req, res) => {
  try {
    const { userId } = req.body;
    const raw = await wishlistModel.find({ userId });
    const ids = raw.map(item => item.propertyId);
    res.json({
      code: 200,
      message: "Wishlist IDs fetched.",
      data: ids
    })
  } catch (err) {
    res.json({
      code: 500,
      message: "Internal Server Error",
      data: []
    })
  }
})
// --- Review & Rating APIs ---
router.post('/add-review', async (req, res) => {
  try {
    const { userId, propertyId, userName, rating, comment } = req.body;
    // Check if user already reviewed this property
    const existing = await reviewModel.findOne({ userId, propertyId });
    if (existing) {
      // Update existing review
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      res.json({
        code: 200,
        message: "Review updated successfully!",
        data: existing
      })
    } else {
      const data = new reviewModel({ userId, propertyId, userName, rating, comment });
      const result = await data.save();
      res.json({
        code: 200,
        message: "Review added successfully!",
        data: result
      })
    }
  } catch (err) {
    res.json({
      code: 500,
      message: "Internal Server Error",
      data: ''
    })
  }
})

router.post('/get-reviews', async (req, res) => {
  try {
    const { propertyId } = req.body;
    const reviews = await reviewModel.find({ propertyId }).sort({ createdAt: -1 });
    // Calculate average
    const avg = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
    res.json({
      code: 200,
      message: "Reviews fetched.",
      data: { reviews, avgRating: parseFloat(avg), totalReviews: reviews.length }
    })
  } catch (err) {
    res.json({
      code: 500,
      message: "Internal Server Error",
      data: ''
    })
  }
})

router.get('/get-all-ratings', async (req, res) => {
  try {
    const reviews = await reviewModel.find({});
    // Group by propertyId
    const ratingsMap = {};
    reviews.forEach(r => {
      const pid = r.propertyId?.toString();
      if (!pid) return; // skip
      if (!ratingsMap[pid]) {
        ratingsMap[pid] = { total: 0, count: 0 };
      }
      ratingsMap[pid].total += Number(r.rating) || 0;
      ratingsMap[pid].count += 1;
    });
    // Convert to averages
    const result = {};
    Object.keys(ratingsMap).forEach(pid => {
      const { total, count } = ratingsMap[pid];
      result[pid] = {
        avg: count > 0 ? parseFloat((total / count).toFixed(1)) : 0,
        count: count
      };
    });
    res.json({
      code: 200,
      message: "Ratings fetched.",
      data: result
    })
  } catch (err) {
    console.error("Error in get-all-ratings:", err);
    res.json({
      code: 500,
      message: err.message,
      data: {}
    })
  }
})

// --- Schedule Visit APIs ---
router.post('/schedule-visit', async (req, res) => {
  try {
    const { userId, propertyId, propertyTitle, userName, userEmail, userPhone, visitDate, visitTime, message } = req.body;
    const data = new visitModel({ userId, propertyId, propertyTitle, userName, userEmail, userPhone, visitDate, visitTime, message });
    const result = await data.save();
    res.json({
      code: 200,
      message: "Visit scheduled successfully!",
      data: result
    })
  } catch (err) {
    res.json({
      code: 500,
      message: "Internal Server Error",
      data: ''
    })
  }
})

router.post('/user-visits', async (req, res) => {
  try {
    const { userId } = req.body;
    const visits = await visitModel.find({ userId }).sort({ createdAt: -1 });
    res.json({
      code: 200,
      message: "Visits fetched.",
      data: visits
    })
  } catch (err) {
    res.json({
      code: 500,
      message: "Internal Server Error",
      data: []
    })
  }
})

export default router;