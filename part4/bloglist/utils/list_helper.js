const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );

  return favorite.title;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = {};
  const mostBlog = {
    author: "",
    blogs: 0,
  };

  blogs.forEach((blog) => {
    authors[blog.author] = authors[blog.author] ? authors[blog.author] + 1 : 1;
  });

  for (const [author, blogs] of Object.entries(authors)) {
    if (blogs > mostBlog.blogs) {
      mostBlog.author = author;
      mostBlog.blogs = blogs;
    }
  }
  return mostBlog;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = {};
  const mostLikes = {
    author: "",
    likes: 0,
  };

  blogs.forEach((blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes;
  });

  for (const [author, likes] of Object.entries(authors)) {
    if (likes > mostLikes.likes) {
      mostLikes.author = author;
      mostLikes.likes = likes;
    }
  }
  return mostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
