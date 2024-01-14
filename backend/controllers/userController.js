const express = require("express");
const userModel = require("../models/userModel");

const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");

const loginController = expressAsyncHandler(async (req,res) => {
    const { name, password } = req.body;
    const user = await userModel.findOne({name});

    console.log("fetched user Data", user);
    console.log(await user.matchPassword(password));


    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
            token: generateToken(user._id),

        })

    }
    else{
        throw new Error("Invalid username or password");
    }


});
const registerController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // check for all input fields.
  if (!name || !email || !password) {
    res.sendStatus(400);
    throw Error("All input fields are not filled");
  }

  // user already exists
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    throw new Error("User already Exists");
  }

  // userName already Taken
  const userNameExists = await userModel.findOne({ name });
  if (userNameExists) {
    throw new Error("Username already Exists");
  }

  // create a database entry for the new User
  const user = await userModel.create({ name, email, password });

  if (user){
    res.status(201).json({
        _id : user._id,
        name : user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token : generateToken(user._id)

    });

  }
  else{
    res.status(400);
    throw new Error("Registration Error");
  }
});




const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await userModel.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    res.send(users);
  });





module.exports = {loginController, registerController, fetchAllUsersController};