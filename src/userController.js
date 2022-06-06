const userModel = require('./userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const validation = require('./validations')

//-----------------------create user-----------------------------------------------------------------

let createUser = async (req, res) => {
    try{
        const {fname, lname, email, phone, password} = req.body
        const salt = await bcrypt.genSalt(6);

        hashedPassword = await bcrypt.hash(password, salt)

        data = {fname, lname, email, phone, password : hashedPassword}

        savedDetails = await userModel.create(data)

        res.status(201).send({status:true, message:'user data saved successfully', data:savedDetails})
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//-----------------------user authentication-----------------------------------------------------------------

let userAuth = async (req, res) => {
    try{
        const {email} = req.body
        const findUser = await userModel.findOne({email})

        let token = jwt.sign(
            {
              userId: findUser._id,
              iat: Math.floor(Date.now())
            }, "sfgsdyfsjhsvsviueuee7re7");
    
        res.header('auth-key', token);
        return res.status(200).send({ status: true, message: "User login successfull", data:token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//-----------------------get userDetails----------------------------------------------------------------

let getUser = async (req, res) => {
    try{
        const filter = req.filter
        const findUser = await userModel.find(filter)

        if(findUser.length < 1){
            return res.status(404).send({status:false, message:'User not found.'})
        }

        return res.status(200).send({status:true, data:findUser})
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//------------------- update user -----------------------------------------------------------------------

const updateUser = async (req, res) => {
    try{
        const filter = req.filter
        const tokenId = req.tokenId

        if(tokenId != req.params.userId){
            return res.status(401).send({status:false, message:'Unauthorized access !!'})
        }
        const updatedDetails = await userModel.findOneAndUpdate(
            {_id:req.params.userId}, filter, {new:true})

        return res.status(200).send({status:true, message:'User details updated successfully', data:updatedDetails})
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//-------------------------delete user -------------------------------------------------------------------

const deleteUser = async (req, res) => {
    try{
        const tokenId = req.tokenId

        if(tokenId != req.params.userId){
            return res.status(401).send({status:false, message:'Unauthorized access !!'})
        } 

        const deletedDetails = await userModel.findOneAndUpdate(
            {_id:req.params.userId}, {isDeleted : true}, {new:true})

        return res.status(200).send({status:true, message:'User details deleted successfully', data:deletedDetails})
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}  
 
module.exports = {createUser, userAuth, getUser, updateUser, deleteUser}