const Product = require("../models/Ticket");
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");
const { CLOUDINARY_STORAGE } = require("../config/config");

async function getAll() {
  return await Product.paginate();
}

async function getRandomProducts() {
  try {
    const randomProducts = await Product.aggregate([{ $sample: { size: 3 } }]);
    return randomProducts;
  } catch (error) {
    console.error(error);
  }
}

async function findByCategory(category) {
  return await Product.find({ category: category });
}

async function findById(id) {
  return await Product.findById(id);
}

async function edit(id, data) {
  return await Product.updateOne({ _id: id }, data);
}

async function create(data, userId) {
  let product = new Product({ ...data });
  await product.save();

  return await User.updateOne({ _id: userId }, { $push: { createdSells: product } });
}

async function uploadImage(image) {
  if (!image) {
    return null;
  }
  const uploadResponse = await cloudinary.uploader.upload(
    image,
    {
      upload_preset: CLOUDINARY_STORAGE,
    },
    { quality: "auto" }
  );

  let imageUrl = uploadResponse.url;
  let index = imageUrl.indexOf("upload/") + 6;

  if (imageUrl.includes(".pdf")) {
    return imageUrl;
  }

  let compressedImg = imageUrl.substring(0, index) + "/c_fit,q_auto,f_auto,w_800" + imageUrl.substring(index);

  return compressedImg;
}

async function userCollectionUpdate(userId, product) {
  return await User.updateOne({ _id: userId }, { $push: { createdSells: product } });
}

async function findUserById(id) {
  return await User.findById(id);
}

module.exports = {
  create,
  getAll,
  findByCategory,
  findById,
  edit,
  uploadImage,
  userCollectionUpdate,
  findUserById,
  getRandomProducts,
};
