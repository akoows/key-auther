const userId = req.params.userId;
const userLicenses = licenses.filter(l => l.userId === userId);
res.json(userLicenses);