const { validationResult, body } = require('express-validator');

const valid = (schemas) => {
    return async (req, res, next) => {
        await Promise.all(schemas.map(schema => schema.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    };
};

module.exports = valid;
