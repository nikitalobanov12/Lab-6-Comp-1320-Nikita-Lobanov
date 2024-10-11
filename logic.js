const fs = require('node:fs/promises');
const { EOL } = require('node:os');

// Helper function for createAPost function
// Replaces whitespace in a string with underscores
const removeWhitespace = (string) => string.replace(' ', '_');

// Helper function to check if a path exists
const pathExists = (path) => fs.access(path)
    .then(() => true)
    .catch(() => false);

// Helper function for createAPost
// Formats the post content to include likes, liked by, and the content
const formatPostContent = (postContent, likes, likedBy) => {
    return `Likes: ${likes}${EOL}Liked By: ${likedBy}${EOL}${postContent}`;
};

// Helper function for register and likePost functions
// Checks if the user exists in the database.txt file
const checkUsernameExists = (username) => {
    return fs.readFile('database.txt', 'utf8')
        .then(data => {
            const usernames = data.trim().split('\n').map(line => line.split(',')[0].trim());
            return usernames.includes(username);
        });
};

// Helper function for createAPost and likePost
// Takes blogName and postTitle as parameters and converts them to a file path
const formatPath = (blogName, postTitle) => {
    return `${blogName}/${removeWhitespace(postTitle)}.txt`;
};

// Helper function for likePost
// Parses the post content to extract likes, likedBy, and content
const parsePostContent = (content) => {
    const [likesLine, likedByLine, ...postContentLines] = content.split(EOL);
    return {
        likes: parseInt(likesLine.replace('Likes: ', '').trim()),
        //converts the string of names to a map in order to easily find them later on
        likedBy: likedByLine.replace('Liked By: ', '').split(', ').map(name => name.trim()),
        content: postContentLines.join(EOL),
    };
};

// Helper function for likePost
// Updates the post likes and likedBy list
const updatePostLikes = (post, username) => {
    if (!post.likedBy.includes(username)) {
        post.likes += 1;
        post.likedBy.push(username);
        console.log(`User ${username} liked this post`);
    } else {
        post.likes -= 1;
        post.likedBy = post.likedBy.filter(name => name !== username);
        console.log(`User ${username} unliked this post`);
    }
    return post;
};

// Helper function to likePost
// reconstructs the post content from the deconstructed post content with updated like count 
const reconstructPostContent = (post) => {
    return `Likes: ${post.likes}${EOL}Liked By: ${post.likedBy.join(', ')}${EOL}${post.content}`;
};

// Helper function for likePost
// Verifies if a user exists and rejects the Promise if not
const verifyUserExists = (username) => {
    return checkUsernameExists(username).then(exists => {
        if (!exists) {
            return Promise.reject(new Error(`Error liking post, user with name ${username} doesn't exist.`));
        }
    });
};

// Helper function for likePost
// Verifies if a post exists and rejects the Promise if not
const verifyPostExists = (postPath) => {
    return pathExists(postPath).then(exists => {
        if (!exists) {
            return Promise.reject(new Error(`Post at ${postPath} does not exist.`));
        }
    });
};

// Helper function for liking or unliking a post
const incrementLike = (path, username) => {
    return fs.readFile(path, 'utf8')
        .then(content => {
            const post = parsePostContent(content);
            const updatedPost = updatePostLikes(post, username);
            const updatedContent = reconstructPostContent(updatedPost);
            return fs.writeFile(path, updatedContent);
        })
        .then(() => {
            console.log(`Post at ${path} was updated`);
        });
};

// Adds a like to the post with the username
const likePost = (blogName, postTitle, username) => {
    const postPath = formatPath(blogName, postTitle);
    return verifyUserExists(username)
        .then(() => verifyPostExists(postPath))
        .then(() => incrementLike(postPath, username));
};

// Creates a new post under the blogName directory as a txt file
const createAPost = (postTitle, postContent, blogName) => {
    let postPath = formatPath(blogName, postTitle);

    return pathExists(blogName)
        .then(exists => {
            if (!exists) {
                throw new Error(`Error creating ${postTitle} under the ${blogName} blog, that blog doesn't exist`);
            }
            return pathExists(postPath);
        })
        .then(postExists => {
            if (postExists) {
                postPath = postPath.replace('.txt', `_${Date.now()}.txt`);
            }
            return fs.writeFile(postPath, formatPostContent(postContent, 1, 'you'));
        })
        .then(() => console.log(`Post ${postTitle} created successfully at ${postPath}`));
};

// Function to register a new user
const register = (username, password) => {
    return checkUsernameExists(username)
        .then(()=> {
            return fs.appendFile('database.txt', `${username}, ${password}\n`);
        })
        .then(() => console.log('User created successfully'));
};

// Creates a directory with the name of the blogName input
const createABlog = (blogName) => {
    return fs.mkdir(blogName)
        .then(() => {
            console.log(`Directory "${blogName}" created successfully.`);
        })
        .catch(error => {
                throw new Error(`Error: A blog with the name "${blogName}" already exists. Please choose another name. ${EOL} ${error}`);
           
        });
};

module.exports = {
    register,
    createABlog,
    createAPost,
    likePost
};
