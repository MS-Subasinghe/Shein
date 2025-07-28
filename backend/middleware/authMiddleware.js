import jwt, { decode } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export const verifyToken = async(req,res, next)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error:"no token provided"});
        }

        const token = authHeader.split(' ')[1]

        jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
                return res.status(403).json({error:"invalid Token"})
            
        }
        req.user = decode;
        next();
    
    
    })
    };

    export const isAdmin = (req,res,next)=>{
        if(req.user.role !== 'admin'){
            return res.status(403).json({error:"admin access Only"})
        }

        next()
    };
