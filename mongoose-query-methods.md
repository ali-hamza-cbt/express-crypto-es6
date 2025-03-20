# Complete Guide to Mongoose Query Methods

## 1. Basic Query Methods

### **1.1 findOne()** - Finds One Document
Finds a single document that matches the query.
```js
const user = await User.findOne({ email: "john@example.com" });
```

### **1.2 find()** - Finds Multiple Documents
Retrieves all matching documents.
```js
const users = await User.find({ age: { $gte: 18 } });
```

### **1.3 findById()** - Finds by `_id`
Finds a document using its `_id` field.
```js
const user = await User.findById("60d9f4f3e1d3f10c78a1e1b2");
```

---

## 2. Updating Documents

### **2.1 findOneAndUpdate()** - Finds, Updates, and Returns New/Old Document
```js
const user = await User.findOneAndUpdate(
  { email: "john@example.com" },
  { $set: { age: 35 } },
  { new: true } // Returns updated document
);
```

### **2.2 findByIdAndUpdate()** - Updates by `_id`
```js
const user = await User.findByIdAndUpdate(
  "60d9f4f3e1d3f10c78a1e1b2",
  { $set: { age: 35 } },
  { new: true }
);
```

### **2.3 updateOne()** - Updates a Single Document
```js
await User.updateOne({ email: "john@example.com" }, { $set: { age: 40 } });
```

### **2.4 updateMany()** - Updates Multiple Documents
```js
await User.updateMany({ role: "user" }, { $set: { isActive: true } });
```

---

## 3. Deleting Documents

### **3.1 findOneAndDelete()** - Finds and Deletes One Document
```js
const deletedUser = await User.findOneAndDelete({ email: "john@example.com" });
```

### **3.2 findByIdAndDelete()** - Deletes by `_id`
```js
await User.findByIdAndDelete("60d9f4f3e1d3f10c78a1e1b2");
```

### **3.3 deleteOne()** - Deletes One Matching Document
```js
await User.deleteOne({ email: "john@example.com" });
```

### **3.4 deleteMany()** - Deletes Multiple Documents
```js
await User.deleteMany({ role: "guest" });
```

---

## 4. Counting & Existence Checks

### **4.1 countDocuments()** - Counts Matching Documents
```js
const count = await User.countDocuments({ role: "admin" });
```

### **4.2 exists()** - Checks If a Document Exists
```js
const userExists = await User.exists({ email: "john@example.com" });
```

---

## 5. Sorting, Limiting, Skipping

### **5.1 sort()** - Sorts Results
```js
const users = await User.find().sort({ age: -1 }); // Descending order
```

### **5.2 limit()** - Limits Number of Results
```js
const users = await User.find().limit(5);
```

### **5.3 skip()** - Skips Results (Pagination)
```js
const users = await User.find().skip(10).limit(5);
```

---

## 6. Selecting & Populating Data

### **6.1 select()** - Select Specific Fields
```js
const user = await User.findOne({ email: "john@example.com" }).select("name email");
```

### **6.2 populate()** - Fetch Referenced Data
```js
const order = await Order.find().populate("userId");
```

---

## 7. Advanced Query Methods

### **7.1 distinct()** - Finds Unique Values in a Field
```js
const roles = await User.distinct("role");
```

### **7.2 `$elemMatch`** - Filtering Arrays
```js
const users = await User.find({ orders: { $elemMatch: { total: { $gte: 100 } } } });
```

### **7.3 `$text` Search** - Full-Text Search
```js
const users = await User.find({ $text: { $search: "developer" } });
```

### **7.4 `$expr`** - Compare Fields in Same Document
```js
const users = await User.find({ $expr: { $gt: ["$spent", "$balance"] } });
```

---

## 8. Performance Optimization

### **8.1 `lean()`** - Convert to Plain Object
```js
const user = await User.findOne({ email: "john@example.com" }).lean();
```

### **8.2 `hint()`** - Use Specific Index
```js
const users = await User.find({ age: { $gt: 25 } }).hint({ age: 1 });
```

### **8.3 `maxTimeMS()`** - Query Timeout
```js
const users = await User.find({ age: { $gt: 25 } }).maxTimeMS(2000);
```

---

## 9. Bulk Operations & Transactions

### **9.1 `bulkWrite()`** - Perform Multiple Operations
```js
await User.bulkWrite([
  { updateOne: { filter: { email: "john@example.com" }, update: { age: 40 } } },
  { deleteOne: { filter: { email: "alice@example.com" } } }
]);
```

### **9.2 Transactions** - Atomic Operations
```js
const session = await mongoose.startSession();
session.startTransaction();
try {
  await User.updateOne({ email: "john@example.com" }, { $inc: { balance: -50 } }, { session });
  await Order.create([{ userId: john._id, amount: 50 }], { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
session.endSession();
```

---

## 🔥 Summary
This guide covers **basic and advanced Mongoose query methods** for creating, updating, deleting, and optimizing queries. Let me know if you need any additional explanations! 🚀

