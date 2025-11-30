const blogsRouter = require("express").Router();
const blog = require("../models/blog");
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
    });

    const savedBlog = await blog.save();

    console.log("request.body:", request.body);
    console.log("savedBlog:", savedBlog);

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
