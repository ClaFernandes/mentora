const User = require("./user.model");
const MentorProfile = require("./mentor.model");
const MenteeProfile = require("./mentee.model");

// Lembrar de apagar aqui também todos os dados relacionados a este utilizador (Posts, Comments, Sessions, Messages, Notifications, Follows) 
const deleteUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("Utilizador não encontrado");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "mentor") {
        await MentorProfile.deleteOne({ userId: user._id });
    }

    if (user.role === "mentee") {
        await MenteeProfile.deleteOne({ userId: user._id });
    }

    await User.deleteOne({ _id: user._id });

    return { message: "Conta apagada com sucesso" };
}

module.exports = { deleteUser };    