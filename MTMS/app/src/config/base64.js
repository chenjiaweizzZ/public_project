
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
export const base64toFile = (base64Str, filename) => {
    const input = base64Str.replace(/^data:\w+\/(\w)+;base64,/, "");
    if ((input.length * 3) % 4 !== 0) {
      throw new TypeError(`Incorrect padding on base64 string.`);
    }
  
    if (!BASE64_REGEX.exec(input)) {
      throw new TypeError(`Invalid base64 string.`);
    }
  
    const arr = base64Str.split(",");
    const mime = arr[0] ? arr[0].match(/:(.*?);/)[1] : 'image/jpeg';
    const suffix = mime.split('/')[1];
    const binary = atob(input);
    const buffer = new ArrayBuffer(binary.length);
    const u8arr = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      u8arr[i] = binary.charCodeAt(i);
    }
    filename = filename || arr[1].substring(0, 32);
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime
    });
  };