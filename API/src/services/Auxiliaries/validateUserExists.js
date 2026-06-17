export function validateUserExists(userId) {
    const user = users.find(u => u.id === parseInt(userId));
    return { user, exists: !!user };
}