const { getImageForCategory, categoryForTitle } = require('./categories');

function productImageForTitle(title) {
  const category = categoryForTitle(title);
  if (!category) return null;
  return getImageForCategory(category.value);
}

function productImageForCategory(categoryValue) {
  return getImageForCategory(categoryValue);
}

module.exports = { productImageForTitle, productImageForCategory };
