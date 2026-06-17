export function validateLicenseExists(licenseKey) {
    const license = licenses.find(l => l.licenseKey === licenseKey);
    return { license, exists: !!license };
}