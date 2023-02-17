import sanitizeString from "./sanitizeString";

class ElementParser {
  blocks: string[] = [];
  constructor(blocks: string[]) {
    this.blocks = blocks;
  }
  val(search: string) {
    var result = "";
    this.blocks.forEach(function (item) {
      if (item.startsWith(`#${search}:`)) {
        result = item.split(": ")[1].replace("#", "");
      }
    });
    return sanitizeString(result);
  }
}

export default ElementParser;
