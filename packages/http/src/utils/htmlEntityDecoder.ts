export const decodeHTMLEntities = (text: string): string => {
    const entities: Record<string, string> = {
        '&quot;': '"',
        '&apos;': "'",
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&'
    };

    return text.replace(/&quot;|&apos;|&lt;|&gt;|&amp;/g, match => entities[match]);
}