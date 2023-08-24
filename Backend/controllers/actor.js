const { isValidObjectId} = require("mongoose");
const Actor = require("../models/actor")
const cloudinary = require('cloudinary').v2;//we use cloudinary to store our images and trailer videos
const { sendError, formatActor } = require("../utils/helper");





cloudinary.config({
    cloud_name: "dwtjkpgz0",
    api_key: "861961659874375",
    api_secret: "eGAaSobohLaRr0jtkk9ap2oL5KQ",
    secure: true,//when we upload files inside cloudinary it will create the url with https is more secure form http
});
//create new user 
exports.createActor = async (req, res) => {
    const { name, about, gender } = req.body;
    const { file } = req //this is the requesting file

    const newActor = new Actor({ name, about, gender });

    if (file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
            { gravity: "face", height: 400, width: 400, crop: "thumb" });//documantation(cloudinary) of reseizing the images because we only want the faces
        newActor.avatar = { url: secure_url, public_id };
    }
    await newActor.save()
    res.status(201).json({ actor: formatActor(newActor) });


};
//update
//things to consider while update
//1) is image file is / avatar is also updating
//2) if yes then remove old image before uploading new image / avatar

exports.updateActor = async (req, res) => {
    const { name, about, gender } = req.body;
    const { file } = req;
    const { actorId } = req.params;

    if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!")
    const actor = await Actor.findById(actorId)
    if (!actor) return sendError(res, "Invalid request, record not found!")

    const public_id = actor.avatar?.public_id;

    //remove old image if there was one
    if (public_id && file) {
        const { result } = await cloudinary.uploader.destroy(public_id)
        if (result !== "ok") {
            return sendError(res, "could not remove image from cloud!")
        }
    }
    //upload new avatar if there is one!
    if (file) {

        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
            { gravity: "face", height: 400, width: 400, crop: "thumb" });
        actor.avatar = { url: secure_url, public_id };
    }
    actor.name = name;
    actor.about = about;
    actor.gender = gender;

    await actor.save()
    res.status(201).json({ actor: formatActor(actor) });
};

exports.removeActor = async (req, res) => {
    const { actorId } = req.params;

    if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");//we check if this id is valid or not

    const actor = await Actor.findById(actorId);
    if (!actor) return sendError(res, "Invalid request, record not found!");//i not we send the error response

    const public_id = actor.avatar?.public_id;

    // remove old image if there was one!
    if (public_id) {
        const { result } = await cloudinary.uploader.destroy(public_id);
        if (result !== "ok") {
            return sendError(res, "Could not remove image from cloud!");
        }
    }

    await Actor.findByIdAndDelete(actorId);

    res.json({ message: "Record removed successfully." });
};


// is find method we use it inside the actor(mongodb documantation), we use template string because we want to fine a spacific name of actor (for example if we have two actors with name tom cruise or tom something and we searching about tom cruise with aout this template query.name the result will be the two of them, but with this query.name we search specific name)
exports.searchActor = async (req, res) => {
    const { name } = req.query;
    // const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
    if (!name.trim()) return sendError(res, "Invalid request!");
    const result = await Actor.find({
      name: { $regex: name, $options: "i" },
    });//we want to search the actor with only 3 letters for example
    const actors = result.map((actor) => formatActor(actor));
    res.json({ results: actors });
};

exports.getLatestActors = async (req, res) => {
    const result = await Actor.findOne().sort({ createdAt: "-1" }).limit(12) //we sort the latest records with -1 from latest to older and the limit is for how many actors want to fetch
    res.json(result);
};
// the functionality to find single actor from our data
exports.getSingleActor = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return sendError(res, "Invalid request!")

    const actor = await Actor.findById(id);
    if (!actor) return sendError(res, "Invalid request, actor not found"(404));

    res.json(actor);
}
// to find actors with pagination
//we find all the actors
//we sorting them we want to select the latest actor at the beggining
//if it skip 0 item and select the items and the actors with this limits f.x if i have this limits of five only select only first five items and if increase the pageNumber this skip will be increased and will skip the value that we have inside the skip method and then it select items according to limit 
exports.getActors = async (req, res) => {
    const { pageNo, limit } = req.query;

    const actors = await Actor.find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit));

    const profiles = actors.map((actor) => formatActor(actor));
    res.json({
        profiles,
    });
};
