const sanitizeString = (string: string) => {
  return string
    .replaceAll('"', "")
    .replaceAll("\t", "")
    .replaceAll("\r", "")
    .replaceAll("\n", "");
};

export default sanitizeString;
