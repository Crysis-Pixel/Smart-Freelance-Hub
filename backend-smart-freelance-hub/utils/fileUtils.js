const fs = require("fs");
const path = require("path");

function deleteFile(relativeFilePath) {
    const absoluteFilePath = path.join(process.cwd(), relativeFilePath);
    fs.unlink(absoluteFilePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
        } else {
            console.log("Old profile picture deleted successfully.");
        }
    });
}

module.exports = { deleteFile };
