import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs'
// User schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        select: false,
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    verifyEmailOTP: {
        type: String,
        select: false,
    },
    verifyEmailOTPExpire: {
        type: Date,
    },
    tagLine: {
        type: String,
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },

    llCoins: {
        type: Number,
        default: 0,
    },
    isGoogleLogin: {
        type: Boolean,
        default: false
    },
    googleAvatar: {
        type: String
    },

    gender: {
        type: String,
    },
    location: {
        type: String,
    },
    birthDay: {
        type: Date,
    },
    about: {
        type: String,
    },
    education: [
        {
            institute: {
                type: String,
            },
            course: {
                type: String,
            },
            startYear: {
                type: String,
            },
            endYear: {
                type: String,
            },

        }
    ],
    skills: {
        type: [String],
        default: [],
    },
    token: {
        type: String,
        select: false,
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },


    resetPasswordOTP: String,
    resetPasswordOTPExpire: Date,
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    try {
        this.password = await bcrypt.hash(this.password, 10);

    } catch (error) {
        next(error)
    }
});



// Compare Password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); //entered password, hashed password
};

// forget password methods

userSchema.methods.getResetPasswordOTP = function () {
    // Generating OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and its expiration time
    this.resetPasswordOTP = otp;
    this.resetPasswordOTPExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    return otp;
};

userSchema.methods.verifyResetPasswordOTP = function (otp) {
    // Check if the OTP is valid and has not expired
    return (
        this.resetPasswordOTP === otp &&
        this.resetPasswordOTPExpire &&
        this.resetPasswordOTPExpire > Date.now()
    );
};








// userSchema.methods.getMailVerifyOTP = function () {
//     // Generating OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     return otp;
// };

// userSchema.methods.setPassword = async function (password) {
//     this.password = await bcrypt.hash(this.password, 10);
// };
// userSchema.methods.verifyEmailPasswordOTP = function (otp) {
//     // Check if the OTP is valid and has not expired
//     console.log("model", this.verifyEmailOTP);
//     console.log("model", this.verifyEmailOTPExpire);
//     console.log("verifyOTP", otp);

//     if (this.verifyEmailOTP == otp) {
//         console.log("Chanasi");
//     }

//     return (
//         this.verifyEmailOTP == otp &&
//         this.verifyEmailOTPExpire &&
//         this.verifyEmailOTPExpire > Date.now()
//     );
// };




export const User = mongoose.model("User", userSchema);