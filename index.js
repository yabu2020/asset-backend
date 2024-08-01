const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./model/Employee");
const AssetModel = require("./model/Asset");

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(
  "mongodb+srv://henokegezew33:yabu2020@cluster0.s4fvdml.mongodb.net/"
);

app.post("", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json(["good", user]);
      } else {
        res.json("The password is incorrect");
      }
    } else {
      res.json("No record existed");
    }
  });
});

app.post("/adduser", (req, res) => {
  const { role, name, email, password } = req.body;
    // Check if the user already exists
    EmployeeModel.findOne({ email: email }).then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: "User is already registered" });
      }
  if (!["user", "Admin", "Clerk", "asset approver"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  const newUser = new EmployeeModel({
    role,
    name,
    email,
    password,
  });
  newUser
  .save()
  .then((employee) => res.json(employee))
  .catch((err) => res.status(400).json(err));
}).catch((err) => res.status(500).json({ error: "Error checking existing user" }));
});
app.get("/users", (req, res) => {
  EmployeeModel.find({})
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: "Error fetching users" }));
});
// Endpoint to register an asset
app.post("/registerasset", (req, res) => {
  const { name, assetno,serialno, model, quantity, description, status } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newAsset = new AssetModel({
    name,
    assetno,
    serialno,
    model,
    quantity,
    description,
    status // Include status in the asset model
  });

  newAsset.save()
    .then((asset) => res.json(asset))
    .catch((err) => res.status(400).json({ error: "Error saving asset" }));
});
// Fetch a specific asset by ID

// Endpoint to get all assets
app.get("/assets", (req, res) => {
  AssetModel.find({})
    .then(assets => res.json(assets))
    .catch(err => res.status(500).json({ message: "Error fetching assets" }));
});
// Update asset information
app.put("/updateasset/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name,assetno, serialno, model, quantity, description, status } = req.body;

    const updatedAsset = await AssetModel.findByIdAndUpdate(id, { name,assetno,serialno,model,quantity, description, status}, { new: true });
    if (updatedAsset) {
      res.json(updatedAsset);
    } else {
      res.status(404).json({ message: "Asset not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating asset" });
  }
});


// Endpoint to reset password
app.post("/resetpassword", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  EmployeeModel.findOne({ email: email }).then((user) => {
    if (user) {
      // For simplicity, we are directly updating the password
      // In a real-world scenario, you would generate a reset token and send an email with the link
      const newPassword = "newpassword"; // Ideally, generate a random password or prompt the user to enter a new one
      user.password = newPassword;
      user.save()
        .then(() => res.json({ message: "Password reset successful. New password is: " + newPassword }))
        .catch((err) => res.status(400).json({ message: "Error resetting password" }));
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

app.listen(3001, () => {
  console.log("server is running");
});