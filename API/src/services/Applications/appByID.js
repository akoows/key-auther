const { application } = validateApplicationExists(req.params.id);
    
    if (!application) {
        return res.status(404).json({ error: 'Aplicação não encontrada' });
    }
    
    res.json(application);