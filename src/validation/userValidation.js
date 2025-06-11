import Joi from 'joi';

// Định nghĩa schema kiểm tra dữ liệu user
const userSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })//Không bắt buộc tên miền cấp cao (TLD) như .com, .net, .vn phải hợp lệ theo danh sách mặc định của Joi.
        .required()
        .messages({
            'string.empty': 'Email không được để trống.',
            'string.email': 'Email không hợp lệ.',
            'any.required': 'Email là bắt buộc.'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Mật khẩu không được để trống.',
            'string.min': 'Mật khẩu phải ít nhất 6 ký tự.',
            'any.required': 'Mật khẩu là bắt buộc.'
        }),

    firstName: Joi.string()
        .required()
        .messages({
            'string.empty': 'Họ không được để trống.',
            'any.required': 'Họ là bắt buộc.'
        }),

    lastName: Joi.string()
        .required()
        .messages({
            'string.empty': 'Tên không được để trống.',
            'any.required': 'Tên là bắt buộc.'
        }),

    // gender: Joi.string()
    //     .valid('0', '1')
    //     .required()
    //     .messages({
    //         'any.only': 'Giới tính phải là "0" hoặc "1".',
    //         'any.required': 'Giới tính là bắt buộc.'
    //     }),

    // roleId: Joi.string().optional(),
    // positionId: Joi.string().optional(),
   // phonenumber: Joi.string().optional(),
    address: Joi.string().optional(),
   // image: Joi.string().optional()
});

// Hàm kiểm tra dữ liệu đầu vào
export const validateUserInput = (data) => {
    const { error } = userSchema.validate(data, {
        abortEarly: false,
        allowUnknown: true // ✅ fix triệt để lỗi bạn gặp
    });

    if (error) {
        const messages = error.details.map(err => err.message);
        return {
            isValid: false,
            errors: messages
        };
    }

    return {
        isValid: true,
        errors: []
    };
};

