import { prisma } from "../lib/prisma.js";
import { secureUser } from "../../dtos/secureUser.js";
import bcrypt from "bcrypt";

export async function userEdit(userID, data) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userID } });

        if (!user) {
            throw new Error("Usuário inexistente!");
        }

        if (data.name && typeof data.name !== "string") {
            throw new Error("Nome inválido!");
        }

        if (data.pass && typeof data.pass !== "string") {
            throw new Error("Senha inválida!");
        }

        const updatedUser = await prisma.user.update({
            where: { id: userID },
            data: {
                name: data.name ?? user.name,
                pass: data.pass ? await bcrypt.hash(data.pass, 10) : user.pass
            }
        });

        return secureUser(updatedUser);
    } catch (error) {
        throw new Error("Erro ao editar o usuário!", { cause: error });
    }
}