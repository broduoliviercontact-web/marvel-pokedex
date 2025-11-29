const getImageUrl = (thumbnail) => {
  return `${thumbnail.path}.${thumbnail.extension}`;
};

export default getImageUrl;
