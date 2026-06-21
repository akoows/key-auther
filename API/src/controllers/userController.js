import { userCreate } from "../services/User/userCreate.js";

export async function userCreateController(req, res) {
    try {
        const user = await userCreate(req.body);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}