const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // For hashing passwords
const EmployeeModel = require("./model/Employee");
const AssetModel = require("./model/Asset");
const AssignmentModel = require("./model/Assignment");
const TransferHistory = require('./model/TransferHistory');


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://henokegezew33:yabu2020@cluster0.s4fvdml.mongodb.net/",
   
);
const validatePassword = (password) => {
  // Check password length
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  // Check password complexity
  const complexityRe =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!complexityRe.test(password)) {
    return "Password must contain at least one letter, one number, and one special character";
  }

  return null;
};

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await EmployeeModel.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No record found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json(["good", user]);
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred during login" });
  }
});
app.post("/adduser", async (req, res) => {
  const { role, id, name, email, password, department } = req.body;

  // Validate inputs
  if (!["user", "Admin", "Clerk", "asset approver"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  try {
    // Check if the user with the same email or id already exists
    const existingUser = await EmployeeModel.findOne({
      $or: [{ email: email }, { id: id }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User is already registered with this email or id" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new EmployeeModel({
      role,
      id,
      name,
      email,
      password: hashedPassword,
      department,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({ error: "Duplicate id or email" });
    } else {
      res.status(500).json({ error: "Error adding user" });
    }
  }
});

app.get("/users", (req, res) => {
  EmployeeModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json({ message: "Error fetching users" }));
});
// Delete user endpoint
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  EmployeeModel.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error deleting user", error: err.message })
    );
});
// Update user endpoint
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { role, name, email, password, department } = req.body;

  // Prepare the update object
  const updateFields = { role, name, email, password, department };
  // Use the findByIdAndUpdate method to update the document
  EmployeeModel.findByIdAndUpdate(id, updateFields, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        // Handle duplicate key error
        res.status(400).json({ error: "Duplicate id or email" });
      } else {
        res
          .status(500)
          .json({ message: "Error updating user", error: err.message });
      }
    });
});

// Endpoint to register an asset
app.post("/registerasset", (req, res) => {
  const {
    assetid,
    name,
    assetno,
    serialno,
    model,
    quantity,
    description,
    status,
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newAsset = new AssetModel({
    assetid,
    name,
    assetno,
    serialno,
    model,
    quantity,
    description,
    status, // Include status in the asset model
  });

  newAsset
    .save()
    .then((asset) => res.json(asset))
    .catch((err) => res.status(400).json({ error: "Error saving asset" }));
});
// Fetch a specific asset by ID

// Endpoint to get all assets
app.get("/assets", (req, res) => {
  AssetModel.find({})
    .then((assets) => res.json(assets))
    .catch((err) => res.status(500).json({ message: "Error fetching assets" }));
});
// Update asset information
app.put("/updateasset/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      assetid,
      name,
      assetno,
      serialno,
      model,
      quantity,
      description,
      status,
    } = req.body;

    const updatedAsset = await AssetModel.findByIdAndUpdate(
      id,
      {
        assetid,
        name,
        assetno,
        serialno,
        model,
        quantity,
        description,
        status,
      },
      { new: true }
    );
    if (updatedAsset) {
      res.json(updatedAsset);
    } else {
      res.status(404).json({ message: "Asset not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating asset" });
  }
});
// Endpoint to assign asset to user
app.post("/giveasset", async (req, res) => {
  const { assetId, userId } = req.body;

  if (!assetId || !userId) {
    return res.status(400).json({ error: "Asset ID and User ID are required" });
  }

  try {
    // Check if the assetId and userId are valid ObjectId strings
    if (!mongoose.Types.ObjectId.isValid(assetId)) {
      return res.status(400).json({ error: "Invalid Asset ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    // Start a session
    const session = await mongoose.startSession();
    session.startTransaction();

    // Find the asset and user
    const asset = await AssetModel.findById(assetId).session(session);
    if (!asset) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Asset not found" });
    }

    const user = await EmployeeModel.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "User not found" });
    }
 
    // Check if the asset is already assigned to the user
    const existingAssignment = await AssignmentModel.findOne({
      // "asset.assetid": assetId,
      // "user.id": userId,
      asset: assetId,
      user: userId,
    }).session(session);

    if (existingAssignment) {
      
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "Asset already assigned to this user" });
    }

    // Check asset quantity
    if (asset.quantity <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Asset quantity is zero" });
    }

    // Decrement asset quantity
    asset.quantity -= 1;
    // Save the updated asset
    await asset.save({ session });
    // console.log("Asset quantity before update:", asset.quantity);

    const assignment = new AssignmentModel({
      asset: assetId, // Use assetId directly
      user: userId,  // Use userId directly
      dateAssigned: new Date(),
    });
    // Save the assignment
    await assignment.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.json(assignment);
  } catch (error) {
    // Abort the transaction if there is an error
    console.error("Error assigning asset:", error);
    res
      .status(500)
      .json({ error: "Error assigning asset", details: error.message });
  }
});

// Endpoint to get all assigned assets
app.get("/assigned-assets", async (req, res) => {
  try {
    const assignments = await AssignmentModel.find({})
      .populate('asset') // Populates the asset field with asset details
      .populate('user')  // Populates the user field with user details
      .exec();

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching assigned assets" });
  }
});


// Endpoint to transfer an asset from one user to another
app.post("/transferasset", async (req, res) => {
  const { assetId, fromUserId, toUserId } = req.body;
  
  if (!assetId || !fromUserId || !toUserId) {
    return res.status(400).json({ error: "Asset ID, from user ID, and to user ID are required" });
  }
try{
  if (!mongoose.Types.ObjectId.isValid(assetId)) {
    return res.status(400).json({ error: "Invalid Asset ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(fromUserId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(toUserId)) {
    return res.status(400).json({ error: "Invalid User ID" });
  }
    
    // Start a session
    const session = await mongoose.startSession();
    session.startTransaction();

   // Find the asset and user
   const asset = await AssetModel.findById(assetId).session(session);
   if (!asset) {
     await session.abortTransaction();
     session.endSession();
     return res.status(404).json({ error: "Asset not found" });
   }

   const fromUser = await EmployeeModel.findById(fromUserId).session(session);
   if (!fromUser) {
     await session.abortTransaction();
     session.endSession();
     return res.status(404).json({ error: "From User not found" });
   }
   const toUser = await EmployeeModel.findById(toUserId).session(session);
   if (!toUser) {
     await session.abortTransaction();
     session.endSession();
     return res.status(404).json({ error: "To User not found" });
   }
     // Check if both users are in the same department
     if (fromUser.department !== toUser.department) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Users must be in the same department to transfer assets" });
    }

    // Find the current assignment
    const currentAssignment = await AssignmentModel.findOne({
      asset: assetId,
      user: fromUserId
    }).session(session);

    if (!currentAssignment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Current assignment not found" });
    }

    // Update the assignment to the new user
    currentAssignment.user = toUserId;
    await currentAssignment.save({ session });

    // Record the transfer in TransferHistory
    const transfer = new TransferHistory({
      asset: assetId,
      fromUser: fromUserId,
      toUser: toUserId,
      dateTransfered: new Date(),
    });
    await transfer.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.json(transfer);
  } catch (error) {
    console.error("Error transferring asset:", error);
    res.status(500).json({ error: "Error transferring asset", details: error.message });
  }
});
// Define an endpoint to fetch transfer history
app.get("/transfer-history", async (req, res) => {
  try {
    const transferHistory = await TransferHistory.find({})
      .populate('asset') // Optional: populate the asset details
      .populate('fromUser') // Optional: populate the user details
      .populate('toUser'); // Optional: populate the user details
    res.json(transferHistory);
  } catch (error) {
    console.error("Error fetching transfer history:", error);
    res.status(500).json({ error: "Error fetching transfer history" });
  }
});


// Endpoint to get assigned assets for a specific user
app.get('/assigned-assets/:userId', async (req, res) => {
  const { userId } = req.params;
console.log(userId);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid User ID' });
  }

  try {
    const userAssignments = await AssignmentModel.find({ 'user.id': userId })
      .populate('asset') // Populates the asset field with asset details
      .exec();
console.log(userAssignments);
    if (!userAssignments || userAssignments.length === 0) {
      return res.status(404).json({ message: 'No assets assigned to this user' });
    }

    res.json(userAssignments);
  } catch (error) {
    console.error('Error fetching user assignments:', error);
    res.status(500).json({ error: 'Error fetching user assignments', details: error.message });
  }
});
// app.get('/assigned-assets/:userId', async (req, res) => {
//   const { userId } = req.params;

//   // Validate userId
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ error: 'Invalid User ID' });
//   }

//   try {
//     // Find the assignments for the user
//     const userAssignments = await AssignmentModel.find({ 'user.id': userId })
//       .populate('asset') // Populates the asset field with asset details
//        .populate('user')  // Populates the user field with user details
//       .exec();

//     // If no assignments are found
//     if (!userAssignments || userAssignments.length === 0) {
//       return res.status(404).json({ message: 'No assets assigned to this user' });
//     }

//     // Respond with the user's assigned assets
//     res.json(userAssignments);
//   } catch (error) {
//     console.error('Error fetching user assignments:', error);
//     res.status(500).json({ error: 'Error fetching user assignments', details: error.message });
//   }
// });


// Endpoint to reset password
app.post("/resetpassword", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  try {
    const user = await EmployeeModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while resetting the password." });
  }
});

app.post('/validate-security', async (req, res) => {
  const { email, securityQuestion, securityAnswer } = req.body;

  if (!email || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const user = await EmployeeModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.securityQuestion !== securityQuestion || user.securityAnswer !== securityAnswer) {
      return res.status(400).json({ success: false, message: 'Security question or answer is incorrect.' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error validating security question:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
  }
});

// Route to get the security question for a user by email
app.get('/security-question', async (req, res) => {
  const { email } = req.query; // Get the email from query parameters

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await EmployeeModel.findOne({ email }).select('securityQuestion securityAnswer');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ securityQuestion: user.securityQuestion, securityAnswer: user.securityAnswer });
  } catch (error) {
    console.error('Error fetching security question:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


app.post('/update-security-question', async (req, res) => {
  const { userId, newSecurityQuestion, newSecurityAnswer } = req.body;

  try {
    const user = await EmployeeModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.securityQuestion = newSecurityQuestion;
    user.securityAnswer = newSecurityAnswer;
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating security question:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});



// Route to reset the password
app.post('/reset-password', async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;

  if (!email || !securityAnswer || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.securityAnswer !== securityAnswer) {
      return res.status(400).json({ message: 'Security answer is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.listen(3001, () => {
  console.log("server is running");
});