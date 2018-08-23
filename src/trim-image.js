/**
 * changed from https://github.com/renanvaz/trim-image
 */

const getPixels   = require('get-pixels');
const savePixels  = require('save-pixels');
const fs          = require('fs');
const path        = require('path');
const mkdirp      = require('mkdirp');

module.exports = function trimImage(filename, filenameOut, ...rest) {
  let crop  = typeof rest[0] == 'function' ? null : rest[0];
  let cb    = typeof rest[0] == 'function' ? rest[0] : (rest[1] ? rest[1] : (err) => {});
  getPixels(filename, (err, pixels) => {
    if (err) {
      cb('Bad image path:', filename);
      return;
    }

    const w = pixels.shape[0];
    const h = pixels.shape[1];

    let i, j, a;

    let cropData = {
      top: 0,
      right: w,
      bottom: h,
      left: 0,
    };

    if(crop) {
        cropData = crop
    }

    top:
    if (!crop) {
      for (j = 0; j < h; j++) {
        cropData.top = j;

        for (i = 0; i < w; i++) {
          a = pixels.get(i, j, 3);

          if (a !== 0) break top;
        }
      }
    }

    right:
    if (!crop) {
      for (i = w - 1; i >= 0; i--) {
        for (j = h - 1; j >= 0; j--) {
          a = pixels.get(i, j, 3);

          if (a !== 0) break right;
        }

        cropData.right = i;
      }
    }

    bottom:
    if (!crop) {
      for (j = h - 1; j >= 0; j--) {
        for (i = w - 1; i >= 0; i--) {
          a = pixels.get(i, j, 3);

          if (a !== 0) break bottom;
        }

        cropData.bottom = j;
      }
    }

    left:
    if (!crop) {
      for (i = 0; i < w; i++) {
        cropData.left = i;

        for (j = 0; j < h; j++) {
          a = pixels.get(i, j, 3);

          if (a !== 0) break left;
        }
      }
    }

    // Check error
    if ((cropData.left > cropData.right) || (cropData.top > cropData.bottom)) {
      cb('Crop coordinates overflow:', filename);
    } else {
      const dirname = path.dirname(filenameOut);

      if (!fs.existsSync(dirname)) {
        mkdirp(dirname, function (err) {
          if (err) console.error(err);
        });
      }

      savePixels(pixels.hi(cropData.right, cropData.bottom).lo(cropData.left, cropData.top), 'png').pipe(fs.createWriteStream(filenameOut));
      cropData['file'] = filenameOut
      cb(false, cropData);
    }
  });
};
