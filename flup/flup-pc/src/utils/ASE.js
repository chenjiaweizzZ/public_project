import CryptoJS from 'crypto-js'

const finalKey = CryptoJS.enc.Utf8.parse('smkldospd121daaa')

const finalIv = CryptoJS.enc.Utf8.parse('1016449182184177')

export default {
  // CBC
  //加密
  encrypt(data) {
    let key = finalKey
    let iv = finalIv
    let srcs = CryptoJS.enc.Utf8.parse(data);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  },
  // 解密
  decrypt(data) {
    let key = finalKey
    let iv = finalIv
    // let encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  },

  // EBC
  // 加密
  // encrypt(data) {
  //   if (data == '' || !data || data.length == 0) {
  //     return ''
  //   }
  //   let key = finalKey
  //   let srcs = CryptoJS.enc.Utf8.parse(data)
  //   let encrypted = CryptoJS.AES.encrypt(srcs, key, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7
  //   })
  //   return encrypted.toString()
  // },
  // // 解密
  // decrypt(data) {
  //   let key = finalKey
  //   let decrypt = CryptoJS.AES.decrypt(data, key, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7
  //   })
  //   return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  // },
}
