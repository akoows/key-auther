const { name, pass } = req.body;
const user = users.find(u => u.name === name);

if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
}

const valid = await bcrypt.compare(pass, user.pass);
if (!valid) {
    return res.status(401).json({ error: "Senha incorreta" });
}

res.json({ id: user.id, name: user.name, email: user.email });