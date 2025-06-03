const { JWT_SECRET } = require("./config");

const  authMiddleware = (req, res, next) => {
    console.log("mid")
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ') ){
        return res.status(403).json({})
    }
    console.log("Mid2")
    const token = authHeader.split(' ')[1];
    console.log(token)
    try{
        console.log("HI")
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded userId:", decoded);
        req.userId = decoded.userId;

        if(req.userId == decoded.userId){
            next();
        }

        
        
    }catch(err){
        return res.status(403).json({})
    }

}

module.exports = {
    authMiddleware
}