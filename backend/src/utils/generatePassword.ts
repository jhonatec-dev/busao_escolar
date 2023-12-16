import * as crypto from 'crypto'

export async function generateRandomPassword(length: number): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    crypto.randomBytes(length, (error, result) => {
      if (error != null) {
        reject(error)
      } else {
        const password = result.toString('base64').slice(0, length)
        resolve(password)
      }
    })
  })
}
