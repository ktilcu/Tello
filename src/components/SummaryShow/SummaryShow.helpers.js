const dpr = window.devicePixelRatio;
const defaultImage = "https://tellotv.imgix.net/placeholder.jpg";

const ImgixClient = require("@imgix/js-core").default;

const client = new ImgixClient({
  domain: "tellotv.imgix.net",
  secureURLToken: "4cVrktCVaEmqESsX",
});

export const buildImageUrl = ({ image, width, height }) =>
  client.buildURL(image||defaultImage, {
    fit: "crop",
    w: width,
    h: height,
    crop: "entropy",
    auto:'enhance', dpr: `${Math.round(dpr)} ${Math.round(width * dpr)}w`
  });
