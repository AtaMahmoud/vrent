# Introduction
This project is the backend of Vrent, an imaginary video rental app. Built with nodeJs 
this app built as Mosh Hamadani Node js [course](https://www.udemy.com/nodejs-master-class/) project.
# Setup

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

**Install MongoDB**
To run this project, you need to install the latest version of MongoDB Community Edition first.

[https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/)

Once you install MongoDB, make sure it's running.

**Install the Dependencies**

Next, from the project folder, install the dependencies:

```
npm i

```

**run the Tests**

You're almost done! Run the tests to make sure everything is working:

```
npm test

```

All tests should pass.

**Start the Server**

```
node index.js

```

This will launch the Node server on port 4000. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to:

[http://localhost:4000/api/genres](http://localhost:4000/api/genres)

You should see the list of genres. That confirms that you have set up everything successfully.

**(Optional) Environment Variables**

If you look at config/default.json, you'll see a property called jwtPrivateKey. This key is used to encrypt JSON web tokens. So, for security reasons, it should not be checked into the source control. I've set a default value here to make it easier for you to get up and running with this project. For a production scenario, you should store this key as an environment variable.

On Mac:

```
export vrent_jwtPrivateKey=yourSecureKey

```

On Windows:

```
set vrent_jwtPrivateKey=yourSecureKey

```

