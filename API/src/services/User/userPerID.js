const { user } = validateUserExists(req.params.id);
    
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { pass, ...safeUser } = user;
    res.json(safeUser);