const express = require("express");
const { createActor, updateActor, removeActor, searchActor, getLatestActors, getSingleActor } = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");
const { isAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/create",
    isAuth,//because we want this route private
    isAdmin,
    uploadImage.single("avatar"),
    actorInfoValidator,
    validate,
    createActor
);

router.post("/update/:actorId",
    isAuth,//because we want this route private
    isAdmin,
    uploadImage.single("avatar"),
    actorInfoValidator,
    validate,
    updateActor
);

router.delete("/:actorId", isAuth,//because we want this route private
    isAdmin, removeActor);
router.get("/search", isAuth,//because we want this route private
    isAdmin, searchActor);
router.get("/latest-uploads", isAuth,//because we want this route private
    isAdmin, getLatestActors);
router.get("/single/:id", getSingleActor);

module.exports = router;