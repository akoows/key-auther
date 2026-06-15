const { license } = validateLicenseExists(req.params.licenseKey);
    
    if (!license) {
        return res.status(404).json({ error: 'Licença não encontrada' });
    }

    const { type, durationDays } = req.body;

    if (type) {
        const validTypes = ['basic', 'premium', 'pro'];
        if (typeof type !== 'string' || !validTypes.includes(type.toLowerCase())) {
            return res.status(400).json({ error: 'Tipo de licença inválido' });
        }
        license.type = type;
    }

    if (durationDays) {
        if (typeof durationDays !== 'number') {
            return res.status(400).json({ error: 'Duração inválida' });
        }
        const newExpirationDate = new Date(license.expirationDate);
        newExpirationDate.setDate(newExpirationDate.getDate() + durationDays);
        license.expirationDate = newExpirationDate.toISOString();
    }

    res.json(license);