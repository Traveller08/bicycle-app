export const verifyAdmin = (req, res, next) => {
    const username = req.user;
    const usertype = req.usertype;
    const id = req.id;

    if(usertype !== "admin"){
        return res.status(403).send({ message: "invalid credentials" });
    }
    // console.log(" user token at admin verfication-> ", req.user, req.usertype, req.id);
    next();
};