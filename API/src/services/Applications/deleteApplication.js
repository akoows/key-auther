const { application, exists } = validateApplicationExists(req.params.id);
    
    if (!exists) {
        return res.status(404).json({ error: 'Aplicação não encontrada' });
    }

    const index = applications.findIndex(a => a.id === application.id);
    applications.splice(index, 1);
    res.status(204).send();