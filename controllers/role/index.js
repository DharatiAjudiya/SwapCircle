const Role = require('../../models/datavalidation/role');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const logger = require("../../utils/logger");

//create role 
const createrole = async (req, res, next) => {
    try {
        const {role} = req.body;
        const roles = new Role({
            role: role
        });

        await roles.save();

        res.status(200).json({ status: true, message: 'Role inserted successfully', roles });
    } catch (error) {
        console.log("Error: ", error);
        logger.error(error)
        res.status(500).json({ status: false, message: error.message });
    }
};

//view roles
const viewroles = async(req, res)=>{
    try{
        const roles = await Role.find();
        res.status(200).json({status: true, message: 'Data fetched successfully!', roles});
        return roles;
    }catch(error){
        console.log(error);
        logger.error(error)
        res.status(500).json({ status: false, message: error.message });
    }
};

//view specific role
const viewspeceficrole = async (req, res) => {
    const roleId = req.params.id;

    // Validate roleId format
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
        return res.status(400).json({ status: false, message: 'Invalid role ID format' });
    }

    try {
        const roles = await Role.findById(roleId);
        if (!roles) {
            return res.status(404).json({ status: false, message: 'Role not found' });
        }
        res.status(200).json({ status: true, message: 'Data fetched successfully', roles });
    } catch (error) {
        console.error('Error:', error);
        logger.error(error)
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

//update role
const updateRole = async(req, res)=>{
    const roleId = req.params.id;
    const updateData = req.body

    // Validate roleId format
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
    return res.status(400).json({ status: false, message: 'Invalid role ID format' });
    }
    try {
     const updaterole = await Role.findByIdAndUpdate(roleId, updateData, {new: true, runValidators: true });

     if(!updaterole){
        return res.status(404).json({ status: false, message: 'Role not found' });
     }  
     res.status(200).json({status: true, message: 'Data updated successfully', updaterole});
    } catch (error) {
        console.log('Error: ',error)
        logger.error(error)
        res.status(500).json({status: false, message: 'Internal sever error'})
    }
};

//delete role
const deleterole = async (req, res)=>{
    let roleId = req.params.id;

    // Validate roleId format
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
    return res.status(400).json({ status: false, message: 'Invalid role ID format' });
    }
    try {
        const deleterole = await Role.findByIdAndDelete(roleId);
        if(!deleterole){
            return null;
        }
        res.status(200).json({status: true, message: 'Role deleted successfully'})
        return deleterole;
    } catch (error) {
        console.log('Error; ', error)
        logger.error(error)
        res.status(500).json({status: false, message: 'Internal server error'})
    }
}

module.exports = {createrole, viewroles, viewspeceficrole, updateRole, deleterole}