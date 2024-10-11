const { register, createABlog, createAPost, likePost } = require('./logic.js');


  const blogName = "Nikita's Blog";
  const post = "Blog post";
  const username = "Nikita";
  
  register(username, "password")
    .then(() => createABlog(blogName))
    .then(() => createAPost(post, "hello world", blogName))
    .then(() => likePost(blogName, post, username))
    .catch((error) => {
      console.error(error.message);
    });

