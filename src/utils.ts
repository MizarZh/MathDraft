export function randomStringGenerator(): string {
  const len = 6,
    charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charSetLen = charSet.length
  let randomString = ''
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSetLen)
    randomString += charSet.substring(randomPoz, randomPoz + 1)
  }
  return randomString
}
