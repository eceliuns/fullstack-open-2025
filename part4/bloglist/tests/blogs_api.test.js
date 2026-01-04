const bcrypt = require("bcrypt");

const { test, after, before, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/User");
const helper = require("./test_helper");

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

let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();

  const passwordHash = await bcrypt.hash("password123", 10);
  await new User({
    username: "testuser",
    name: "Test User",
    passwordHash,
  }).save();

  const loginResponse = await api.post("/api/login").send({
    username: "testuser",
    password: "password123",
  });

  token = loginResponse.body.token;
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

test.only("HTTP request to api/blogs successfully creates a new blog"),
  async () => {
    const newBlog = {
      title: "New Blog",
      author: "Test Author",
      url: "http://example.com",
      likes: 5,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

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

test.only("adding a blog fails with status code 401 if token is not provided", async () => {
  const newBlog = {
    title: "Unauthorized Blog",
    author: "Author",
    url: "http://example.com",
    likes: 1,
  };
  const response = await api.post("/api/blogs").send(newBlog);
  assert.strictEqual(response.status, 401);
  const blogsAfter = await Blog.find({});
  assert.strictEqual(blogsAfter.length, initialBlogs.length);
});

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

test("PUT /api/blogs/:id updates a blog", async () => {
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

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test.only("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails if username is shorter than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "12",
      name: "testName",
      password: "123456",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("shorter than the minimum allowed length")
    );
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails if username is missing", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "testName",
      password: "123456",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("Path `username` is required"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails if password is missing", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "testUsername",
      name: "testName",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("password is required"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails if password is shorter than 3 characters"),
    async () => {
      const usersAtStart = await helper.usersInDb();
      const newUser = {
        username: "testUsername",
        name: "testName",
        password: "12",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes(
          "password must be at least 3 characters long"
        )
      );
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    };
});

after(async () => {
  await mongoose.connection.close();
});
