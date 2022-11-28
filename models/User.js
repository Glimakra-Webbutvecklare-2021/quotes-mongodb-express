// DONE: Create Quote Model Schema
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { exit } from "process";

// read from .env file and add to process.env
dotenv.config();

// exit program if no connection string
if (!process.env.MONGO_CONNECTION_STR) {
  console.error("MONGO_CONNECTION_STR is not defined in .env file");
  exit();
}

// connect to database
const uri = process.env.MONGO_CONNECTION_STR;
mongoose.connect(uri);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: "must be filled in",
    lowercase: true,
    unqiue: true,
    match: [/^[a-zA-Z0-9]+$/, "is invalid"]
  },
  email: {
    type: String,
    required: "must be filled in",
    lowercase: true,
    unqiue: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    required: "must be filled in",
    minLength: 4,
    maxLength: 36,
  },
}, {timestamps: true});

userSchema.pre("save", function(next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }

        this.password = bcrypt.hashSync(this.password, 10);
        next();
    } catch (err) {
        throw err;
    }
})


userSchema.methods.comparePassword = async function (plainTextPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    } catch (err) {
        throw new Error("Incorrect password", err);
    }
}


const UserModel = mongoose.model("User", userSchema);

export default UserModel;
