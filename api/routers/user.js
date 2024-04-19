const express = require("express");
const router = express.Router();


const UserControllers = require("../controllers/users")

router.post("/signup", UserControllers.user_signup );

router.post("/login",UserControllers.user_login );

router.delete("/:userId",UserControllers.user_delete);

module.exports = router;
