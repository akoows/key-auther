try {
    // Criação do usuário
    const hashedPass = await bcrypt.hash(pass, 10);
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const user = {
        id: newId,
        name,
        email,
        pass: hashedPass,
        createdAt: new Date().toISOString(),
        avatarUrl: 'https://res.cloudinary.com/dylkeqcms/image/upload/v1762125098/default_uqhrk3.jpg'
    };

    users.push(user);

    // Retorna usuário sem senha
    const { pass: _, ...safeUser } = user;
    res.status(201).json(safeUser);

} catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
}