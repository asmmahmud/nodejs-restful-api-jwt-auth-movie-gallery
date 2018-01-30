const Joi = require('joi');
/*
const userDataSchema = Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      password: Joi.string()
        .required()
        .regex(/.{4,15}/),
      confirm_password: Joi.ref('password'),
      email: Joi.string()
        .email()
        .required()
    });
	*/
const userDataSchema = Joi.object().keys({
      first_name: Joi.string().required().label('First Name').error(() => 'First Name is required.'),
      last_name: Joi.string().required().label('Last Name').error(() => 'Last Name is required.'),
      password: Joi.string()
        .regex(/.{4,15}/).allow('', null).label('Password').error(() => 'Password length has to be between 4 to 15 characters.'),
      confirm_password: Joi.string().strip()
	  .valid(Joi.ref('password'))
	  
	  .label('Confirm Password')
	  .error(() => 'Confirm Password did not match with Password.'),
      email: Joi.string()
        .email()
        .required().label('Email').error(() => 'Valid email is required.'),
    });
	//.with('password', 'confirm_password');	
	
const userData = {
	first_name: 'mahmud',
	last_name: 'hasan',
	password: 'ldjdlj',
	confirm_password: 'ldjdlj',
	email: 'asmmgm.com'
	
};
	Joi.validate(userData, userDataSchema, (err, value) => {
		console.log('error: ', err.message);
		console.log('value: ', value);
	});