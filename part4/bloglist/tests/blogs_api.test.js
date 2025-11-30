const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Test1",
    author: "Author1",
  },

  {
    title: "Test2",
    author: "Author2",
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blogs have id property and it is unique", async () => {
  const response = await api.get("/api/blogs");
  const blogs = response.body;

  // Check that all blogs have the id parameter
  blogs.forEach((blog) => {
    assert.ok(blog.id, "Blog must have an id property");
  });

  // Check uniqueness of id parameter
  for (let i = 0; i < blogs.length; i++) {
    for (let j = i + 1; j < blogs.length; j++) {
      assert.notStrictEqual(
        blogs[i].id,
        blogs[j].id,
        "Blog ids must be unique"
      );
    }
  }
});

test("HTTP request to api/blogs successfully creates a new post"),
  async () => {
    const newBlog = {
      title: "New Blog",
      author: "Test Author",
      url: "http://example.com",
      likes: 5,
    };

    const response = await api.post("/api/blogs").send(newBlog);

    assert.strictEqual(response.status, 201, "Response status should be 201");
    assert.ok(
      response.headers["content-type"].includes("application/json"),
      "Response should be JSON"
    );

    const blogsAfter = await Blog.find({});
    assert.strictEqual(blogsAfter.length, 3);

    //Verify the new blog is saved correctly
    const titles = blogsAfter.map((b) => b.title);
    assert.ok(titles.includes("New Blog"), "New blog title should be in DB");
  };

test.only("if likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Blog missing likes",
    author: "Test Author",
    url: "http://example.com",
  };

  const response = await api.post("/api/blogs").send(newBlog);
  assert.strictEqual(response.status, 201, "Status should be 201");
  assert.ok(
    response.headers["content-type"].includes("application/json"),
    "Response should be JSON"
  );

  assert.strictEqual(
    response.body.likes,
    0,
    "Likes should default to 0 when missing"
  );
});

after(async () => {
  await mongoose.connection.close();
});
