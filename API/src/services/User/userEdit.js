const { user } = validateUserExists(req.params.id);

if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
}

const { name, pass } = req.body;

if (name) {
    if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Nome inválido' });
    }
    if (users.find(u => u.name === name && u.id !== user.id)) {
        return res.status(409).json({ error: 'Nome de usuário já existe' });
    }
    user.name = name;
}

if (pass) {
    if (typeof pass !== 'string') {
        return res.status(400).json({ error: 'Senha inválida' });
    }
    user.pass = await bcrypt.hash(pass, 10);
}

const { pass: _, ...safeUser } = user;
res.json(safeUser);