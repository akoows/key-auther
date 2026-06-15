const { appId } = req.params;
  const { tag, default_duration } = req.body;

  if (!tag || !default_duration || isNaN(default_duration)) {
    return res.status(400).json({ error: 'Campos inválidos.' });
  };

  const appIndex = applications.findIndex(a => a.id === parseInt(appId));

  if (appIndex === -1) {
    return res.status(404).json({ error: 'Aplicação não encontrada.' });
  }

  applications[appIndex].config.tag = tag;
  applications[appIndex].config.default_duration = parseInt(default_duration);

  res.json({
    message: 'Configurações atualizadas com sucesso.',
    updatedApp: applications[appIndex]
  });