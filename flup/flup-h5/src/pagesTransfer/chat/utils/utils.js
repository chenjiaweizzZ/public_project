import TUIChatEngine from "@tencentcloud/chat-uikit-engine";

export function deepCopy(data, hash = new WeakMap()) {
  if (typeof data !== "object" || data === null || data === undefined) {
    return data;
  }
  if (hash.has(data)) {
    return hash.get(data);
  }
  const newData = Object.create(Object.getPrototypeOf(data));
  const dataKeys = Object.keys(data);
  dataKeys.forEach((value) => {
    const currentDataValue = data[value];
    if (typeof currentDataValue !== "object" || currentDataValue === null) {
      newData[value] = currentDataValue;
    } else if (Array.isArray(currentDataValue)) {
      newData[value] = [...currentDataValue];
    } else if (currentDataValue instanceof Set) {
      newData[value] = new Set([...currentDataValue]);
    } else if (currentDataValue instanceof Map) {
      newData[value] = new Map([...currentDataValue]);
    } else {
      hash.set(data, data);
      newData[value] = deepCopy(currentDataValue, hash);
    }
  });
  return newData;
}

export const throttle = (fn) => {
  let isRunning = false;
  return (...args) => {
    if (isRunning) return;
    setTimeout(() => {
      fn.apply(this, args);
      isRunning = false;
    }, 100);
  };
};

export const handleSkeletonSize = (
  width,
  height,
  maxWidth,
  maxHeight
) => {
  const widthToHeight = width / height;
  const maxWidthToHeight = maxWidth / maxHeight;
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }
  if (
    (width <= maxWidth && height > maxHeight) ||
    (width > maxWidth && height > maxHeight && widthToHeight <= maxWidthToHeight)
  ) {
    return { width: width * (maxHeight / height), height: maxHeight };
  }
  return { width: maxWidth, height: height * (maxWidth / width) };
};

// Image loading complete
export function getImgLoad(container, className, callback) {
  const images = container.querySelectorAll(`.${className}`) || [];
  const promiseList = Array.prototype.slice.call(images).map((node) => {
    return new Promise((resolve, reject) => {
      node.onload = () => {
        resolve(node);
      };
      node.onloadeddata = () => {
        resolve(node);
      };
      node.onprogress = () => {
        resolve(node);
      };
      if (node.complete) {
        resolve(node);
      }
    });
  });
  return Promise.all(promiseList)
    .then(() => {
      callback && callback();
    })
    .catch((e) => {
      console.error("网络异常", e);
    });
}

export const isCreateGroupCustomMessage = (message) => {
  return (
    message.type === TUIChatEngine.TYPES.MSG_CUSTOM &&
    message.getMessageContent().businessID === "group_create"
  );
};