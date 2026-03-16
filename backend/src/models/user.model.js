import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already exist "],
        required: true
    },
    email: {
        type: String,
        unique: [true, "Account already exists with this email address"],
        requried: true

    },

    password: {
        type: String,
        required: true
    }
})

userSchema.statics.hashpassword = async function (password) {
    return bcrypt.hash(password, 10);
};

userSchema.methods.comparepassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = async function () {
    const payload = {
        id: this._id,
        username: this.username,
        email: this.email,
        
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

const userModel = mongoose.model("users", userSchema)

export default userModel