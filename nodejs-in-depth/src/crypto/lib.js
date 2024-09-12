const crypto = require('crypto')

const algorithms = ['aes-256-ctr', 'aes-192-cbc', 'aes-256-cbc']
const secretKeys = algorithms.map((algorithm) =>
    crypto.randomBytes(algorithm.includes('192') ? 24 : 32)
)

const encrypt = (algorithm, text) => {
    const index = algorithms.indexOf(algorithm)
    if (index === -1) throw new Error('Unsupported algorithm')

    const iv = crypto.randomBytes(16) // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, secretKeys[index], iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return {
        algorithm,
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    }
}

const decrypt = (hash) => {
    const {algorithm, iv, content} = hash
    const index = algorithms.indexOf(algorithm)
    if (index === -1) throw new Error('Unsupported algorithm')

    const decipher = crypto.createDecipheriv(algorithm, secretKeys[index], Buffer.from(iv, 'hex'))
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(content, 'hex')),
        decipher.final()
    ])
    return decrypted.toString()
}

const hash = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex')
}

const generateKeyPair = () => {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    })
}

const signData = (privateKey, data) => {
    const sign = crypto.createSign('SHA256')
    sign.update(data)
    sign.end()
    return sign.sign(privateKey, 'hex')
}

const verifySignature = (publicKey, data, signature) => {
    const verify = crypto.createVerify('SHA256')
    verify.update(data)
    verify.end()
    return verify.verify(publicKey, signature, 'hex')
}

module.exports = {
    encrypt,
    decrypt,
    hash,
    generateKeyPair,
    signData,
    verifySignature,
    algorithms
}
