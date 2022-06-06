const userModel = require('./userModel')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const isValidReqBody = requestBody => Object.keys(requestBody).length > 0;

const isValidValue = value => {
    if (typeof value === "undefined" || value === null)
        return false;
    if (typeof value === "string" && value.trim().length === 0)
        return false;
    return true;
};

const isValidEmail = email =>  (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email));

const isValidPhone = phone => (/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone));

const isValidObjectId = objectId => mongoose.Types.ObjectId.isValid(objectId)

//----------------------------------- validation middlewares ---------------------------------------------------------------------------------


let userCreateValidation = async (req, res, next) => {
    try{

        const {fname, lname, email, phone, password} = req.body

        if(!(isValidReqBody(req.body))){
            return res.status(400).send({status:false, message:'Request body should not be empty.'})
        }

        if(!(isValidValue(fname))){
            return res.status(400).send({status:false, message:'Please provide your first name.'})
        }

        if(!(isValidValue(lname))){
            return res.status(400).send({status:false, message:'Please provide your last name.'})
        }

        if(!(isValidValue(email))){
            return res.status(400).send({status:false, message:'Please provide your email id.'})
        }

        if(!(isValidEmail(email))){
            return res.status(400).send({status:false, message:'Invalid email id.'})
        }

        let isDuplicateEmail = await userModel.findOne({ email })
        if (isDuplicateEmail) {
            return res.status(400).send({ status: false, message: "Email id already exists" })
        }

        if(!(isValidValue(phone))){
            return res.status(400).send({status:false, message:'Please provide your phone number.'})
        }

        if(!(isValidPhone(phone))){
            return res.status(400).send({status:false, message:'Invalid phone number'})
        }

        let isDuplicatePhone = await userModel.findOne({ phone })
        if (isDuplicatePhone) {
            return res.status(400).send({ status: false, message: "phone no. already exists" })
        }

        if(!(isValidValue(password))){
            return res.status(400).send({status:false, message:'Please provide the password.'})
        }

        next()

    }catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let userAuth = async (req, res, next) => {
    try{
        const {email, password} = req.body

        if(!(isValidReqBody(req.body))){
            return res.status(400).send({status:false, message:'Request body should not be empty.'})
        }

        if(!(isValidValue(email))){
            return res.status(400).send({status:false, message:'Please provide your email id.'})
        }

        if(!(isValidValue(password))){
            return res.status(400).send({status:false, message:'Please provide the password.'})
        }

        if(!(isValidEmail(email))){
            return res.status(400).send({status:false, message:'Invalid email id.'})
        }

        let isCorrectEmail = await userModel.findOne({ email })
        if (!isCorrectEmail) {
            return res.status(403).send({ status: false, message: "Login failed! Invalid Credentials." })
        }
        
        const isCorrectPassword = await bcrypt.compare(password, isCorrectEmail.password)

        if(!isCorrectPassword){
            return res.status(403).send({status:false, message:'Login failed! Invalid Credentials.'})
        }

        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getUser = async (req, res, next) => {
    try{
        const data = req.query
        const filter = { isDeleted : false }
        
        if(data.fname){
            if(!(isValidValue(data.fname))){
                return res.status(400).send({status:false, message:'Please provide your first name.'})
            }

            filter['fname'] = data.fname
        }

        if(data.lname){
            if(!(isValidValue(data.lname))){
                return res.status(400).send({status:false, message:'Please provide your last name.'})
            }

            filter['lname'] = data.lname
        }

        if(data.email){
            if(!(isValidValue(email))){
                return res.status(400).send({status:false, message:'Please provide your email id.'})
            }
    
            if(!(isValidEmail(email))){
                return res.status(400).send({status:false, message:'Invalid email id.'})
            }

            filter['email'] = data.email
        }

        if(data.phone){
            if(!(isValidValue(phone))){
                return res.status(400).send({status:false, message:'Please provide your phone number.'})
            }
    
            if(!(isValidEmail(phone))){
                return res.status(400).send({status:false, message:'Invalid phone number.'})
            }

            filter['phone'] = data.phone
        }

        if(data.userId){
            if(!(isValidObjectId(data.userId))){
                return res.status(400).send({status:false, message:'Invalid user id.'})
            }

            filter['_id'] = data.userId
        }
        req.filter = filter
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateUser = async (req, res, next) => {
    try{
        const userId = req.params.userId

        const {fname, lname, phone, email} = req.body

        const filter = {}

        if(!(isValidObjectId(userId))){
            return res.status(400).send({status:false, message:'Invalid user id in param.'})
        }

        const isValidUser = await userModel.findById({_id : userId})

        if(!isValidUser || isValidUser.isDeleted === true){
            res.status(404).send({status:false, message:'User not found'})
        }

        if(!(isValidReqBody(req.body))){
            return res.status(400).send({status:false, message:'Request body should not be empty.'})
        }

        if(fname){
            if(!(isValidValue(fname))){
                return res.status(400).send({status:false, message:'Please provide your first name.'})
            }

            filter['fname'] = fname
        }

        if(lname){
            if(!(isValidValue(lname))){
                return res.status(400).send({status:false, message:'Please provide your last name.'})
            }

            filter['lname'] = lname
        }

        if(email){
            if(!(isValidValue(email))){
                return res.status(400).send({status:false, message:'Please provide your email id.'})
            }
    
            if(!(isValidEmail(email))){
                return res.status(400).send({status:false, message:'Invalid email id.'})
            }

            filter['email'] = email
        }

        if(phone){
            if(!(isValidValue(phone))){
                return res.status(400).send({status:false, message:'Please provide your phone number.'})
            }
    
            if(!(isValidEmail(phone))){
                return res.status(400).send({status:false, message:'Invalid phone number.'})
            }

            filter['phone'] = phone
        }

        req.filter = filter
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteUser = async (req, res, next) => {
    try{
        const userId = req.params.userId

        if(!(isValidObjectId(userId))){
            return res.status(400).send({status:false, message:'Invalid user id in params.'})
        }

        const isValidUser = await userModel.findById({_id : userId})

        if((!(isValidUser) )|| isValidUser.isDeleted === true){
            res.status(404).send({status:false, message:'User not found'})
        }

        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {userCreateValidation, userAuth, getUser, updateUser, deleteUser}


