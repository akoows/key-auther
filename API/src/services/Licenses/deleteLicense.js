const licenseKey = req.params.licenseKey;
    const index = licenses.findIndex(l => l.licenseKey === licenseKey);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Licença não encontrada' });
    }

    licenses.splice(index, 1);
    res.status(204).send();