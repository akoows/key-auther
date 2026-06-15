const { ownerId } = req.query;
    
    if (ownerId) {
        const userId = parseInt(ownerId);
        const userApplications = applications.filter(app => 
            app.ownerID.includes(userId)
        );
        return res.json(userApplications);
    }
    
    res.json(applications);