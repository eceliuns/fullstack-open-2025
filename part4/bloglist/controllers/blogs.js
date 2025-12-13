const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const token = request.token;
    const body = request.body;

    // check that a user is provided
    if (!body.userId) {
      return response.status(400).json({ error: "UserId is required" });
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }

    console.log("Decoded token:", decodedToken);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response
        .status(400)
        .json({ error: "UserId missing or not valid" });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ error: "malformatted id" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return response.status(404).json({ error: "blog not found" });
    }

    return response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { id } = request.params;
  const { title, author, url, likes } = request.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: "malformatted id" });
  }

  const updatedBlogData = { title, author, url, likes };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedBlogData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return response.status(404).json({ error: "blog not found" });
    }

    response.json(updatedBlog.toJSON());
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
