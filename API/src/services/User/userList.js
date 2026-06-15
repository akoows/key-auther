const safeUsers = users.map(user => {
    const { pass, ...safeUser } = user;
    return safeUser;
});
res.json(safeUsers);