import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const createAccountValidate = (data) => {
    const userSchema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: passwordComplexity(),
        confirmPassword: Joi.any()
            .equal(Joi.ref("password"))
            .required()
            .label("Confirm password")
            .messages({ "any.only": "{{#label}} does not match" }),
    });

    return userSchema.validate(data);
};

const loginAccountValidate = (data) => {
    const userSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });

    return userSchema.validate(data);
};

export { createAccountValidate, loginAccountValidate };
