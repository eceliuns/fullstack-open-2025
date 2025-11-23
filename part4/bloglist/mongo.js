require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.TEST_MONGODB_URI;
console.log("Using DB URI:", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
  });

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const blog1 = new Blog({
  title: "Test1",
  author: "Author1",
});

const blog2 = new Blog({
  title: "Test2",
  author: "Author2",
});

Promise.all([blog1.save(), blog2.save()])
  .then(() => {
    console.log("blogs saved!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("error saving blogs:", err.message);
  });
