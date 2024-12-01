/**
 * Converts a base64 string to a data URL that can be used as an image source
 * @param base64String The raw base64 string
 * @param mimeType The MIME type of the image (defaults to image/png)
 */
export const base64ToDataUrl = (base64String: string, mimeType = 'image/png') => {
  // Check if the string already starts with data:image
  if (base64String.startsWith('data:image')) {
    return base64String;
  }
  return `data:${mimeType};base64,${base64String}`;
}; 