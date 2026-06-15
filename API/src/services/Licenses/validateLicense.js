const { license } = validateLicenseExists(req.params.licenseKey);

if (!license) {
    return res.status(404).json({ error: 'Licença não encontrada' });
}

// Se a licença já está ativa, verifica se expirou
if (license.status === 'active') {
    const now = new Date();
    const expiration = new Date(license.expirationDate);
    
    if (now > expiration) {
        license.status = 'expired';
        return res.status(400).json({ 
            error: 'Licença expirada',
            status: 'expired'
        });
    }

    return res.json({
        valid: true,
        status: 'active',
        expiresIn: Math.ceil((expiration - now) / (1000 * 60 * 60 * 24)),
        expirationDate: license.expirationDate
    });
}

// Se a licença está inativa, ativa ela
if (license.status === 'inactive') {
    const activatedAt = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(activatedAt.getDate() + license.durationDays);

    license.activatedAt = activatedAt.toISOString();
    license.expirationDate = expirationDate.toISOString();
    license.status = 'active';

    return res.json({
        valid: true,
        status: 'activated',
        activatedAt: license.activatedAt,
        expirationDate: license.expirationDate,
        durationDays: license.durationDays
    });
}

// Licença expirada
return res.status(400).json({
    error: 'Licença expirada',
    status: 'expired'
});