import { check, validationResult, body } from 'express-validator';

const validateUserInput = [
  check('firstname')
    .trim()
    .notEmpty()
    .withMessage('firstname is required')
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
    .withMessage('input a valid firstname')
    .customSanitizer((name) => name.toLowerCase()),

  check('lastname')
    .trim()
    .notEmpty()
    .withMessage('lastname is required')
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
    .withMessage('input a valid lastname')
    .customSanitizer((name) => name.toLowerCase()),

  check('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .withMessage('Input a valid email')
    .customSanitizer((name) => name.toLowerCase()),

  check('username')
    .trim()
    .notEmpty()
    .withMessage('username is required')
    .matches(/^[a-zA-Z0-9\s,.'-]{3,}$/)
    .withMessage('username should be more than 2 characters')
    .customSanitizer((name) => name.toLowerCase()),

  check('isAdmin')
    .trim()
    .notEmpty()
    .withMessage('isAdmin field is required')
    .isBoolean()
    .withMessage('Must be a boolean value, true or false')
    .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
    .withMessage('invalid input for admin')
    .customSanitizer((name) => name.toLowerCase()),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Password Should have a minimum length of 5'),
];

const validateLoginInput = [
  check('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .withMessage('Input a valid email')
    .customSanitizer((name) => name.toLowerCase()),

  check('password').trim().notEmpty().withMessage('Password is required'),
];

const validateParcelInput = [
  check('weight')
    .trim()
    .notEmpty()
    .withMessage('weight field is required')
    .isFloat()
    .withMessage('Must be a float number'),

  check('weight_metric').trim().notEmpty().withMessage('weigth_metric is required'),

  check('from')
    .trim()
    .notEmpty()
    .withMessage('from Address field is required')
    .isLength({ min: 5 })
    .withMessage('Address should be a minimum of 5 characters')
    .matches(/^[a-zA-Z0-9\s,.'-]{3,}$/)
    .withMessage('Invalid Address format entered'),

  check('to')
    .trim()
    .notEmpty()
    .withMessage('to Address field is required')
    .isLength({ min: 5 })
    .withMessage('Address should be a minimum of 5 characters')
    .matches(/^[a-zA-Z0-9\s,.'-]{3,}$/)
    .withMessage('Invalid Address format entered'),

  check('currentLocation')
    .trim()
    .notEmpty()
    .withMessage('currentLocation field is required')
    .isLength({ min: 5 })
    .withMessage('Address should be a minimum of 5 characters')
    .matches(/^[a-zA-Z0-9\s,.'-]{3,}$/)
    .withMessage('Invalid Address format entered'),
];

const validateStatusInput = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('status field is required')
    .customSanitizer((name) => name.toLowerCase())
    .matches(/\b(?:placed|transiting|delivered)\b/)
    .withMessage('status can either be placed, transiting, delivered'),
];

const validateCancelInput = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('status field is required')
    .customSanitizer((name) => name.toLowerCase())
    .matches(/\b(?:cancelled)\b/)
    .withMessage('status can only be cancelled'),
];

const handleValitaionError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      error: errors.array()[0].msg,
    });
  }

  next();
};

export {
  validateUserInput,
  validateLoginInput,
  validateParcelInput,
  validateStatusInput,
  validateCancelInput,
  handleValitaionError,
};
