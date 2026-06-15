const userId = parseInt(req.params.id);
const index = users.findIndex(u => u.id === userId);

if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
}

users.splice(index, 1);
res.status(204).send();