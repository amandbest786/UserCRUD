const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
        const token = req.headers["api-key"];
        if (!token) {
        return res.status(403).send({status: false, message: `Token is missing in request`,});
        }

        const decodeToken = jwt.verify(token, "sfgsdyfsjhsvsviueuee7re7");
        if (!decodeToken) {
        return res.status(403).send({status: false,message: `Invalid authentication token in request`,});
        }

        req.tokenId = decodeToken.userId;
        next();
  }
  catch (err) {
    res.status(500).send({ msg: err.message });
  }
}; 

module.exports = {userAuth}
