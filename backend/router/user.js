const express = require("express")
const router = express.Router();
const zod = require("zod");
const {User, Account} = require("../db");
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config");
const {authMiddleware} = require("../middleware");

const signupBody = zod.object({
    username : zod.string().email(),
    firstname : zod.string(),
    lastname : zod.string(),
    password : zod.string()
})

const signinBody = zod.object({
    username : zod.string().email(),
    password : zod.string()
})



router.post('/signup', async (req, res) =>{
    console.log("hi")
    const {success} = signupBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message : "Incorrect Inputs"
        })
    }

    const existingUser = await User.findOne({
        username : req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message : "Username/Email already taken"
        })
    }

    const user = await User.create({
        username : req.body.username,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        password : req.body.password
    })

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1+ Math.random() * 10000
    })
    
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        message : "User created Successfully.",
        token : token
    })
})

router.post('/signin', async (req, res) => {
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Invalid input"
        })
    }

    const existingUser = await User.findOne({
        username : req.body.username,
        password : req.body.password
    })

    if(existingUser){
        const token = jwt.sign({
            userId : existingUser._id
        }, JWT_SECRET)

        res.json({
            token : token 
        })
        return;
    }

    res.status(411).json({
        message : "Error while logging in."
    })

})

const updateBody = zod.object({
    firstname : zod.string().optional(),
    lastname : zod.string().optional(),
    password : zod.string().optional()
});

router.put('/update', authMiddleware, async(req, res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message : "Error while updating the information."
        })
    }

    await User.updateOne({_id: req.userId}, req.body);

    res.json({
        message: "Updated Successfully"
    })
})

router.get('/bulk', async (req, res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstname : {
                $regex : filter
            }
        },
            {
                lastname : {
                    $regex : filter
                }  
        }]
    })
    
    res.json({
        user: users.map(user => ({
            username : user.username,
            firstname : user.firstname,
            lastname : user.lastname,
            _id : user._id
        }))
    })
})


module.exports = router;