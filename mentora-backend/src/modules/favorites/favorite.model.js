const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    menteeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    offeringId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offering",
        required: true,
    },
}, { timestamps: true });

favoriteSchema.index({ menteeId: 1, offeringId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;