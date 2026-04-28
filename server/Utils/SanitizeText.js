// const sanitizeText = (text) => {
//   if (!text) return text;

//   return text
//     // Fix common encoding issues
//     .replace(/�/g, "’")   // replace bad char with proper apostrophe
//     .replace(/â€™/g, "’")
//     .replace(/â€œ/g, "“")
//     .replace(/â€/g, "”")

//     // Optional: normalize unicode
//     .normalize("NFC")

//     // Trim extra spaces
//     .trim();
// };
const sanitizeText = (text) => {
  if (!text) return text;

  return text
    .normalize("NFKD") // better normalization
    .replace(/[^\x00-\x7F]/g, (char) => {
      const map = {
        "’": "'",
        "“": '"',
        "”": '"',
      };
      return map[char] || char;
    })
    .replace(/�/g, "")
    .trim();
};

module.exports = sanitizeText;