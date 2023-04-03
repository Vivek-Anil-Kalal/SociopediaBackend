import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/User.js"

/** REGISTER USER */
export const register = async (req, res) => {

    try {
        // Pass object from frontend that contains these values
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)
        console.log(passwordHash);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewdProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })

        const savedUser = await newUser.save();
        res.status(201).json(savedUser)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

/** LOGGING IN */
export const login = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await User.findOne({ email: email })

        /**
         * Another Way if not using await  
        // user.exec().then((user) => {
        //     console.log(user); // the retrieved user object
        //     console.log(user.email); // the retrieved user object
        // }).catch((err) => {
        //     // handle the error
        // });

        */
        if (!user) return res.status(400).json({ error: "User Doesn't exists..." })
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return res.status(400).json({ error: "Invalid Credentials..." })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        // so that it won't sent back to the client 
        delete user.password;

        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: console.log(err.message) })
    }
} 