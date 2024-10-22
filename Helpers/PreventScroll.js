export const numberInputOnWheelPreventChange = (e) => {
  e.target.blur();
  setTimeout(() => {
    e.target.focus();
  }, 0);
};

export const groupItems = (items, itemsPerGroup) => {
  return items.reduce((acc, item, idx) => {
    if (idx % itemsPerGroup === 0) acc.push([]);
    acc[acc.length - 1].push(item);
    return acc;
  }, []);
};

// Debounce function to limit the rate at which the handleResize function is invoked
export const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export const fileFormat = (attachment = "") => {
  const fileExt = attachment.split(".").pop();

  if (
    fileExt === "mp4" ||
    fileExt === "webm" ||
    fileExt === "ogg" ||
    fileExt === "mkv"
  )
    return "video";

  if (
    fileExt === "png" ||
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "svg" ||
    fileExt === "webp" ||
    fileExt === "gif"
  )
    return "image";

  return "file";
};

export const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};
