import CryptoJS from 'crypto-js'

const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY // Should be stored in environment variables

// Encrypt function
export const encrypt = text => {
  return encodeURIComponent(CryptoJS.AES.encrypt(String(text), secretKey).toString())
}

// Decrypt function
export const decrypt = ciphertext => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)

  return decodeURIComponent(bytes.toString(CryptoJS.enc.Utf8))
}

const SECRET_KEY = CryptoJS.enc.Utf8.parse('12345678901234567890123456789012') // 32 bytes key

// 🔒 Encrypt
export const encryptData = data => {
  const text = typeof data === 'string' ? data : JSON.stringify(data)

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(text), // explicitly parse input text
    SECRET_KEY,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  )

  return encrypted.ciphertext.toString(CryptoJS.enc.Base64) // consistent Base64
}

// 🔓 Decrypt
export const decryptData = cipherText => {
  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    },
    SECRET_KEY,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  )

  const plainText = decrypted.toString(CryptoJS.enc.Utf8)
  try {
    return JSON.parse(plainText)
  } catch {
    return plainText
  }
}
