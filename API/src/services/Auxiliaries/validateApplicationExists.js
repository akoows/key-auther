export function validateApplicationExists(appId) {
    const application = applications.find(a => a.id === parseInt(appId));
    return { application, exists: !!application };
}