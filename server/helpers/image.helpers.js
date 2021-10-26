const AWS = require('aws-sdk');
const request = require('request');
const slugify = require('slugify');

// Configure S3
const BUCKET_NAME = 'telloapp';

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });

module.exports.uploadImage = ({ key, url }) =>
  new Promise((resolve, reject) => {
    // Sometimes, shows don't have a URL. In those cases, skip this one.
    if (!url) {
      resolve();
      return;
    }

    request({ url, encoding: null }, (err, res, body) => {
      if (err) {
        reject(err);
      }

      s3.putObject(
        {
          Key: key,
          Bucket: BUCKET_NAME,
          Body: body,
        },
        (err, data) => {
          if (err) console.error({ err });
          resolve(`https://s3.amazonaws.com/${BUCKET_NAME}/${key}`);
        }
      );
    });
  });

module.exports.getImageFilenameForShow = show =>
  slugify(`${show.name}-${show.region || 'US'}.jpg`);
