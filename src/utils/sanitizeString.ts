const sanitizeString = (string: string) => {
    return string.replaceAll('"', '');
}

export default sanitizeString;
