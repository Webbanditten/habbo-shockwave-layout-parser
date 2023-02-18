const assetUrl = (asset: string, type: "png" | "element") => {
  return `assets/${asset}.${type}`;
};

export default assetUrl;
