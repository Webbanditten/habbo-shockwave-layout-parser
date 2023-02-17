import * as im from "imagemagick";
import { readdir } from "fs";
import { join, extname } from "path";

function convert(filePath, fileName) {
  const inputFilePath = filePath;
  const outputFilePath = `./output/${fileName}`;
  const borderColor = "pink";
  const fillColor = "transparent";

  // Define border size
  const borderSize = 1;

  // Define shave parameters
  const shaveParams = `${borderSize}x${borderSize}`;
  console.log(inputFilePath);
  // Add border and flood fill with transparency
  im.convert([inputFilePath, "resize", "50%", outputFilePath], (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(
      `Successfully added border, flood filled with ${fillColor}, and removed border from ${inputFilePath}. Result saved to ${outputFilePath}.`
    );
  });
}

function listPngFiles(folderPath) {
  readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const filePath = join(folderPath, file.name);
      if (file.isDirectory()) {
        listPngFiles(filePath);
      } else if (extname(filePath) === ".png") {
        //console.log(filePath);
        convert(filePath, file.name);
      }
    });
  });
}

// Example usage:
listPngFiles("./original_assets/hh_interface");
