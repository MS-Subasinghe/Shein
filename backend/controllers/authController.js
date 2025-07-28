import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register = async(req,res)=>{

    try{
        const {name, username, email, address, phone,password} = req.body;

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"email already in use"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const user = new User({
            name,
            username,
            email,
            address,
            phone,
            password:hashedPassword,
        })

    await user.save();
    res.status(201).json({ message: "User registered successfully" });

} catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
}
}


export const login = async(req,res)=>{

    try{
        const{email,password} = req.body;

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"})
        }

        const token = jwt.sign(
            {id:user._id,username:user.username,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        )

        res.json({
            token,
            user:{
                id:user._id,
                name:user.name,
                username:user.username,
                email:user.email,
                role:user.role

            }
        })

    }catch{
  res.status(500).json({message:err.message})
    }
}