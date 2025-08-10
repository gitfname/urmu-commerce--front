/**
 * Estimates the reading time for a given text.
 * @param text - The text content to estimate reading time for.
 * @param wordsPerMinute - Average reading speed in words per minute (default: 200).
 * @param additionalSecondsPerImage - Additional seconds to add per image (default: 10).
 * @param imageCount - Number of images or media in the content (default: 0).
 * @returns A formatted string representing the estimated reading time (e.g., "5 min read").
 */
export function estimateReadingTime(
    text: string,
    wordsPerMinute: number = 200,
    additionalSecondsPerImage: number = 10,
    imageCount: number = 0
): string {
    // Remove extra whitespace and split the text into words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Calculate reading time in seconds based on word count and reading speed
    const readingTimeSeconds = Math.ceil((wordCount / wordsPerMinute) * 60);

    // Add additional time for images or media
    const additionalTimeSeconds = imageCount * additionalSecondsPerImage;

    // Total time in seconds
    const totalSeconds = readingTimeSeconds + additionalTimeSeconds;

    // Convert to minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format the output based on the duration
    if (minutes < 1) {
        return `${seconds} ثانیه`;
    } else if (seconds < 30) {
        return `${minutes} دقیقه`;
    } else {
        return `${minutes + 1} دقیقه`; // Round up if seconds are 30 or more
    }
}

// Example usage:
// const sampleText = `
//     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//     Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
//     Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
//     Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
// `;

// console.log(estimateReadingTime(sampleText)); // Output: "1 min read"
// console.log(estimateReadingTime(sampleText, 200, 10, 2)); // Output: "1 min read" (with additional time for 2 images)