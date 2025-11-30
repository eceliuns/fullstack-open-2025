const { test, after, before, beforeEach } = require("node:test");
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

test("if likes property is missing, it defaults to 0", async () => {
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

test("DELETE /api/blogs/:id deletes a blog", async () => {
  const newBlog = {
    title: "Blog to delete",
    author: "Test Author",
    url: "http://testurl.com",
    likes: 10,
  };

  const postedBlog = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  await api.delete(`/api/blogs/${postedBlog.body.id}`).expect(204);
});

test.only("PUT /api/blogs/:id updates a blog", async () => {
  const blogsAtStart = await Blog.find({});
  const blogToUpdate = blogsAtStart[0];

  const updatedData = {
    title: "Updated Title",
    author: "Updated Author",
    url: "http://updated.com",
    likes: 103,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  // Check that the response matches updated data
  assert.strictEqual(response.body.title, updatedData.title);
  assert.strictEqual(response.body.author, updatedData.author);
  assert.strictEqual(response.body.url, updatedData.url);
  assert.strictEqual(response.body.likes, updatedData.likes);

  // Check that DB has been updated
  const blogsAtEnd = await Blog.find({});
  const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
  assert.strictEqual(updatedBlog.title, updatedData.title);
  assert.strictEqual(updatedBlog.likes, updatedData.likes);
});

after(async () => {
  await mongoose.connection.close();
});
