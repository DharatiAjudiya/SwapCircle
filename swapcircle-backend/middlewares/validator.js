const {body} = require('express-validator');

// role validation rules
const rolevalidation = [
    body('role').notEmpty().withMessage('Role is required').isString().withMessage('Role must be a String').isIn(['Admin', 'User',]).withMessage('Role must be Admin or User'),
];

//user validation rules
const uservalidation =[
    body('username').notEmpty().withMessage('User name is required').isString().withMessage('Username must be a String'),
    body('email').notEmpty().withMessage('Email is required').isString().withMessage('Email must be a String'),
    body('password').notEmpty().withMessage('Password is required'),
    body('level').notEmpty().optional().withMessage('level id required'),
    body('points').notEmpty().optional().withMessage('points id required'),
    body('average_rating').notEmpty().optional().withMessage('average_rating id required'),
    body('badges').notEmpty().optional().withMessage('badges id required'),
];

//category validation rules
const categoryvalidation = [
    body('category').notEmpty().withMessage('Category in required!').isString().withMessage('Category must be a string'),
    body('status').notEmpty().withMessage('Status is required').isString().withMessage('Status must be a string').isIn(['Active','Inactive']).withMessage('Status must be Active or Inactive')
]

//itms validation rule
const itemsvalidation = [
    body('name').notEmpty().withMessage('Item name must not be empty').isString().withMessage('Item name must be string'),
    body('description').notEmpty().withMessage('description must not be empty').isString().withMessage('description must be a string'),
    body('tags').notEmpty().withMessage('taggs must not be empty').isString().withMessage('tags must be string'),
    body('eco_friendly').isIn(['true','false']).withMessage('must be true or false'),
    body('recycleable').isIn(['true','false']).withMessage('must be true or false'),
    body('consition').isString().withMessage('must be a string').isIn(['Vintage', 'Old', 'Used', 'Likely New', 'Brand New']).withMessage('Condition must be from this Vintage, Old, Used, Likely New, Brand New'),
    body('status').isIn(['Active', 'Inactive']).withMessage('must be Active or Inactive'),
    body('price').isNumeric().withMessage('must be a Integer'),
    body('selling_status').isIn(['true','false']).withMessage('must be true or false'),
    body('location').isString().withMessage('must be a string'),
]


module.exports = { uservalidation, rolevalidation, categoryvalidation, itemsvalidation };