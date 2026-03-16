import userModel from "../models/user.model.js";
import tokenBlacklistModel from "../models/blacklist.model.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "please provide username, email and password"
        });
    }

    try {

        const isUserExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserExists) {
            return res.status(400).json({
                message: "account already exists with this email or username"
            });
        }

        const hashedPassword = await userModel.hashpassword(password);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = await user.generateAuthToken();

        res.cookie("token", token);

        return res.status(201).json({
            message: "User registered successfully",
            user,
            token
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isMatch = await user.comparepassword(password)
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = await  user.generateAuthToken();


    res.cookie("token",token)
     res.json({ user, token });
}


export const logout = async (req,res)=>{
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "user logout succesfully"
    })
}

export const getme = async (req,res)=>{
    const user =  await userModel.findById(req.user.id)
    res.status(200).json({
        user
    })
}