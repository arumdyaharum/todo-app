import { body } from 'express-validator';

const validateUserRegistration = [
  body('name').isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isLength({ min: 1 }).withMessage('Email is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  
  body('email').isEmail().withMessage('Email must be a valid email address'),
  body('password').isStrongPassword().withMessage('Password needs to be minimum 8 characters and contains lowercase, uppercase, number, and special character'),
]

const validateUserLogin = [
  body('email').isLength({ min: 1 }).withMessage('Email is required'),
  body('email').isEmail().withMessage('Email must be a valid email address'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
]

const validateTodo = [
  body('title').isLength({ min: 1 }).withMessage("Title of to-do is required"),
];

const validateProject = [
  body('name').isLength({ min: 1 }).withMessage("Name of project is required"),
];

export {
  validateUserRegistration,
  validateUserLogin,
  validateTodo,
  validateProject,
}