
/**
 * Extracts plain text from HTML string by removing all tags
 * Used for rendering HTML content in react-pdf
 */
export function parseHtmlToText(htmlString: string | undefined): string {
  if (!htmlString) return "";

  try {
    // Remove all HTML tags
    return htmlString
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  } catch (error) {
    console.error("Error parsing HTML to text:", error);
    return htmlString;
  }
}


/**
 * Parses HTML and extracts list items as separate lines
 * Used when HTML contains lists that should be rendered as bullets
 */
export function parseHtmlToLines(htmlString: string | undefined): string[] {
  if (!htmlString) return [];

  try {
    const lines: string[] = [];

    // Extract list items
    const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
    let match;
    let foundListItems = false;

    while ((match = liRegex.exec(htmlString)) !== null) {
      foundListItems = true;
      const text = match[1]
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

      if (text.length > 0) {
        lines.push(text);
      }
    }

    // If list items were found, return them
    if (foundListItems) {
      return lines;
    }

    // Extract paragraphs as fallback
    const pRegex = /<p[^>]*>(.*?)<\/p>/gi;
    while ((match = pRegex.exec(htmlString)) !== null) {
      const text = match[1]
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

      if (text.length > 0) {
        lines.push(text);
      }
    }

    // If we found paragraphs, return them
    if (lines.length > 0) {
      return lines;
    }

    // Final fallback: split by line breaks and remove tags
    return htmlString
      .replace(/<[^>]*>/g, "\n")
      .split("\n")
      .map((line) =>
        line
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim()
      )
      .filter((line) => line.length > 0);
  } catch (error) {
    console.error("Error parsing HTML to lines:", error);
    // Fallback: try simple text extraction
    return htmlString
      .replace(/<[^>]*>/g, "\n")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
}
