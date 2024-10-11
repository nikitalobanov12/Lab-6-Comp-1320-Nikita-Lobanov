You are creating an application to manage blogs for users. The functionality is as follows:

A user can:

`register(username,password)`

This function should save their username and password into a text file called "database.txt" if the user does not already exist in that text file. If they already exist, you should generate an error letting them know that a user with that name already exists. 

`createABlog(blogName)` 

This function should create a directory called "blogName". It should print a message when the directory has been created successfully. If a blog with the same name exists, it should print an error saying to choose a blog with another name. 

`createPost(postTitle, postContent, blogName)` 

This function should create a text file titled: postTitle with the content inside it. If the title contains any spaces, make sure to replace the spaces with underscores _.  The text file should be placed in the folder that matches blogName. If the folder does not exist, you should show an error message to the user. If the user tries to create another post with the same postTitle, let them do so, but add something to the end of the fileName to make the postTitle unique so the original is not overwritten. 

Your text file must be structured like this: (Obviously, post content will be your actual post content)

---

likes:1

likedBy: you

post content post content post content post content post content post content post content post content post content post content post content post content post content post content post content

---

`likePost(blogName, postTitle, username)` 

This function should first check the  database to see if the username passed into this function is a user who exists in the database. If it is, find the post matching the postTitle passed in for the blog, and on the very first line of the file, update the likes counter.  After doing this, add the username to the "likedBy" line. By default, there will already be 1 like in every post which is liked by you, so add a comma after "you" and then put the username. 

Implement the above functionality below. Use Promises for your solution. Create two files. main.js and logic.js.