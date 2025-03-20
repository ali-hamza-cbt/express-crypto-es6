Complete MongoDB (Mongoose) Documentation with Examples

Table of Contents

Introduction to Mongoose

Setting Up Mongoose

Defining Schemas & Models

CRUD Operations

Query Methods & Filtering

Aggregation Framework

Indexing & Performance Optimization

Transactions & Atomic Operations

Middleware (Hooks)

Virtuals & Instance Methods

Relationships & Population

Query Methods (Complete Guide)

Best Practices

Error Handling

Mongoose Plugins

Advanced Features & Miscellaneous

1️⃣ Introduction to Mongoose

Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js, providing schema validation, middleware, and query-building capabilities.

Key Features:

Schema-based models

Middleware (pre & post hooks)

Population (Relationships between collections)

Built-in query methods & aggregation

Indexing for performance optimization

2️⃣ Setting Up Mongoose

Install Mongoose:

npm install mongoose

Connect to MongoDB:

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myDatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Connection Error:", error);
  }
};

connectDB();

3️⃣ Defining Schemas & Models

Create a Schema:

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, min: 18 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

4️⃣ CRUD Operations

Create a User (Insert):

const newUser = new User({
  name: "John Doe",
  email: "john@example.com",
  password: "hashedpassword",
  age: 25,
});
await newUser.save();

Read Users (Find):

const users = await User.find(); // Get all users
const user = await User.findOne({ email: "john@example.com" });
const userById = await User.findById("65f3c8a7d4e9b23f7a4d2c89");

Update a User:

const updatedUser = await User.findOneAndUpdate(
  { email: "john@example.com" },
  { age: 30 },
  { new: true }
);

Delete a User:

await User.deleteOne({ email: "john@example.com" });
await User.findByIdAndDelete("65f3c8a7d4e9b23f7a4d2c89");

5️⃣ Query Methods & Filtering

const activeUsers = await User.find({ age: { $gt: 20 } }).sort({ age: -1 }).limit(10);

$gt: Greater than

$lt: Less than

$in: Match multiple values

$exists: Check field existence

$regex: Pattern matching

6️⃣ Aggregation Framework

const userStats = await User.aggregate([
  { $group: { _id: "$age", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

7️⃣ Indexing & Performance Optimization

userSchema.index({ email: 1 });

Use indexes for faster queries.

8️⃣ Transactions & Atomic Operations

const session = await mongoose.startSession();
session.startTransaction();
try {
  await User.create([{ name: "Alice" }], { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}

9️⃣ Middleware (Hooks)

userSchema.pre("save", function(next) {
  this.name = this.name.toUpperCase();
  next();
});

🔟 Virtuals & Instance Methods

userSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

1️⃣1️⃣ Relationships & Population

const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Post = mongoose.model("Post", postSchema);
const posts = await Post.find().populate("author");

1️⃣2️⃣ Query Methods (Complete Guide)

Basic Find Operations:

const allUsers = await User.find();
const singleUser = await User.findOne({ email: "john@example.com" });
const userById = await User.findById("65f3c8a7d4e9b23f7a4d2c89");

Filtering with Conditions:

const usersAbove30 = await User.find({ age: { $gt: 30 } });

Sorting & Limiting:

const sortedUsers = await User.find().sort({ age: -1 }).limit(5);

Counting Documents:

const userCount = await User.countDocuments({ age: { $gt: 30 } });

Updating Documents:

await User.updateOne({ email: "john@example.com" }, { age: 35 });
await User.findOneAndUpdate({ email: "john@example.com" }, { age: 40 }, { new: true });

Deleting Documents:

await User.deleteOne({ email: "john@example.com" });
await User.findByIdAndDelete("65f3c8a7d4e9b23f7a4d2c89");

1️⃣3️⃣ Best Practices

Use indexes for performance

Use lean() for read-only queries

Avoid deeply nested schemas

1️⃣4️⃣ Error Handling

try {
  await User.create({ email: "invalid" });
} catch (error) {
  console.error(error);
}

1️⃣5️⃣ Mongoose Plugins

import mongoosePaginate from "mongoose-paginate-v2";
userSchema.plugin(mongoosePaginate);

1️⃣6️⃣ Advanced Features & Miscellaneous

Caching with Redis

Soft delete (adding isDeleted flag)

Using MongoDB Atlas for cloud storage

🚀 Summary

This guide covers everything you need to master Mongoose. If you need more details on a specific topic, feel free to ask! 🚀

