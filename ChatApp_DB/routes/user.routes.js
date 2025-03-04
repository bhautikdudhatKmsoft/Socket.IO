const userRoute = require('express').Router();
const {addUser,updateUser,getUser} = require('../controller/user.controller');

userRoute.post('/add-user',addUser);
userRoute.put('/update-user',updateUser);
userRoute.get('/get-user',getUser);

module.exports  = userRoute;