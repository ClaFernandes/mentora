const Favorite = require("./favorite.model");
const Offering = require("../offerings/offering.model");
const { Session } = require("../booking/booking.models");

const addFavorite = async (menteeId, offeringId) => {
    const offering = await Offering.findById(offeringId);
    if (!offering) {
        const error = new Error("Oferta não encontrada");
        error.statusCode = 404;
        throw error;
    }

    // Versão antiga que dependia de status "completed", que  nunca chega a ser persistido no sistema atual. Atualizar quando fizer bloco 4
    // const hasCompletedSession = await Session.findOne({
    //   menteeId,
    //   offeringId,
    //   status: "completed",
    // });
    //
    // if (!hasCompletedSession) {
    //   const error = new Error(
    //     "Só podes favoritar ofertas com as quais já tiveste uma sessão concluída",
    //   );
    //   error.statusCode = 403;
    //   throw error;
    // }

    // Versão atual: verifica "confirmed" ou "completed" e cruza com a data/hora já ter passado, em vez de depender só do status
    const candidateSessions = await Session.find({
        menteeId,
        offeringId,
        status: { $in: ["confirmed", "completed"] },
    });

    const now = new Date();
    const hasPastSession = candidateSessions.some((session) => {
        const sessionDateTime = new Date(`${session.date}T${session.time}:00`);
        return sessionDateTime < now;
    });

    if (!hasPastSession) {
        const error = new Error(
            "Só podes favoritar ofertas com as quais já tiveste uma sessão concluída",
        );
        error.statusCode = 403;
        throw error;
    }

    const existing = await Favorite.findOne({ menteeId, offeringId });
    if (existing) {
        const error = new Error("Já favoritaste esta oferta");
        error.statusCode = 400;
        throw error;
    }

    const favorite = await Favorite.create({ menteeId, offeringId });
    return favorite;
};

const removeFavorite = async (menteeId, offeringId) => {
    await Favorite.deleteOne({ menteeId, offeringId });
    return { message: "Oferta removida dos favoritos" };
};

const getFavorites = async (menteeId) => {
    const favorites = await Favorite.find({ menteeId }).populate("offeringId");
    return favorites;
};

module.exports = { addFavorite, removeFavorite, getFavorites };