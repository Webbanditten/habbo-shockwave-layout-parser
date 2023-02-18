import { ButtonProps } from "../types/LayoutElement";
import sanitizeString from "./sanitizeString";

class ElementParser {
  blocks: string[] = [];
  constructor(blocks: string[]) {
    this.blocks = blocks;
  }
  getButtonMemberPropVal(members: string, search: string) {
    let result = "";
    members.split("], ").forEach(function (item) {
      if (item.startsWith(`#${search}:`)) {
        result = item.replaceAll("]", "").replaceAll("[", "");
        result = result.replace(`#${search}:`, "").trim();
      }
    });
    return result;
  }
  getPropVal(blocks: string[], search: string) {
    let result = "";
    blocks.forEach(function (item) {
      if (item.startsWith(`#${search}:`)) {
        result = item.split(": ")[1].replace("#", "");
      }
    });
    return sanitizeString(result);
  }

  val(search: string) {
    return this.getPropVal(this.blocks, search);
  }
  parseButtonProp() {
    const r: ButtonProps = {
      state: null,
      members: {
        left: {
          member: null,
        },
        right: {
          member: null,
        },
        middle: {
          member: null,
        },
      },
      text: {
        font: null,
        fontSize: null,
        fontStyle: null,
        alignment: null,
        color: null,
        bgColor: null,
        boxType: null,
        marginH: null,
        marginV: null,
      },
    };
    const concatBlocks = this.blocks.join(", ");
    const stateMatch = concatBlocks.match(/#state:\s*([^,]+)/);
    if (stateMatch) {
      r.state = stateMatch[1];
    }

    const membersMatch = concatBlocks.match(/#members:\s*\[(.+)\]/);
    if (membersMatch) {
      const left = this.getButtonMemberPropVal(membersMatch[1], "left").split(
        ", "
      );
      const middle = this.getButtonMemberPropVal(
        membersMatch[1],
        "middle"
      ).split(", ");
      const right = this.getButtonMemberPropVal(membersMatch[1], "right").split(
        ", "
      );
      const text = this.getButtonMemberPropVal(membersMatch[1], "text").split(
        ", "
      );

      r.members.left.member = this.getPropVal(left, "member");
      r.members.middle.member = this.getPropVal(middle, "member");
      r.members.right.member = this.getPropVal(right, "member");
      r.text.font = this.getPropVal(text, "font");
      r.text.fontSize = parseInt(this.getPropVal(text, "fontSize"));
      r.text.fontStyle = this.getPropVal(text, "fontStyle");
      r.text.alignment = this.getPropVal(text, "alignment");
      r.text.color = this.getPropVal(text, "color");
      r.text.bgColor = this.getPropVal(text, "bgColor");
      r.text.boxType = this.getPropVal(text, "boxType");
      r.text.marginH = parseInt(this.getPropVal(text, "marginH"));
      r.text.marginV = parseInt(this.getPropVal(text, "marginV"));
    }

    return r;
  }
}

export default ElementParser;
