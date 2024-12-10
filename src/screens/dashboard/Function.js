export function compareVersions(str1, str2) {
    // Split both version strings into arrays of numbers
    const arr1 = str1.split('.').map(Number);
    const arr2 = str2.split('.').map(Number);

    // Find the largest length between the two arrays
    const maxLength = Math.max(arr1.length, arr2.length);

    for (let i = 0; i < maxLength; i++) {
        // If a version component is missing, consider it as 0
        const num1 = arr1[i] || 0;
        const num2 = arr2[i] || 0;

        // Compare the corresponding parts of the versions
        if (num1 > num2) {
            return 1; // str1 is greater than str2
        } else if (num1 < num2) {
            return -1; // str1 is less than str2
        }
    }

    return 0; // Both versions are equal
}
