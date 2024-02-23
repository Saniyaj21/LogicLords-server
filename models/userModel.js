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
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    verifyEmailOTP: {
        type: String,
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
            // required: true,
        },
        url: {
            type: String,
            // required: true,
        },
    },
    password: {
        type: String,
        required: true,
        default: "",
    },
    llCoins: {
        type: Number,
        default: 0,
    },
    isGoogleLogin: {
        type: Boolean,
        default: false
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

    createdAt: {
        type: Date,
        default: Date.now,
    },
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});



userSchema.methods.getMailVerifyOTP = function () {
    // Generating OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and its expiration time
    this.verifyEmailOTP = otp;
    this.verifyEmailOTPExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    return otp;
};

// userSchema.methods.setPassword = async function (password) {
//     this.password = await bcrypt.hash(this.password, 10);
// };
userSchema.methods.verifyEmailPasswordOTP = function (otp) {
    // Check if the OTP is valid and has not expired
    console.log("model", this.verifyEmailOTP);
    console.log("model", this.verifyEmailOTPExpire);
    console.log("verifyOTP", otp);

    if (this.verifyEmailOTP == otp) {
        console.log("Chanasi");
    }

    return (
        this.verifyEmailOTP == otp &&
        this.verifyEmailOTPExpire &&
        this.verifyEmailOTPExpire > Date.now()
    );
};




export const User = mongoose.model("User", userSchema);