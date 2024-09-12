const {
    encrypt,
    decrypt,
    hash,
    generateKeyPair,
    signData,
    verifySignature,
    algorithms
} = require('./lib')

describe('Crypto Utils', () => {
    algorithms.forEach((algorithm) => {
        test(`should encrypt and decrypt text correctly using ${algorithm}`, () => {
            const text = 'Hello, World!'
            const encrypted = encrypt(algorithm, text)
            const decrypted = decrypt(encrypted)

            expect(decrypted).toBe(text)
        })

        test(`should generate different encrypted outputs for the same text using ${algorithm}`, () => {
            const text = 'Hello, World!'
            const encrypted1 = encrypt(algorithm, text)
            const encrypted2 = encrypt(algorithm, text)

            expect(encrypted1.content).not.toBe(encrypted2.content)
            expect(encrypted1.iv).not.toBe(encrypted2.iv)
        })
    })

    test('should hash text correctly', () => {
        const text = 'Hello, World!'
        const hashed = hash(text)

        // Ensure hash has correct length
        expect(hashed.length).toBe(64)

        // Ensure same input produces same hash
        const hashedAgain = hash(text)
        expect(hashed).toBe(hashedAgain)
    })

    test('should produce different hashes for different inputs', () => {
        const text1 = 'Hello, World!'
        const text2 = 'Hello, Universe!'
        const hashed1 = hash(text1)
        const hashed2 = hash(text2)

        expect(hashed1).not.toBe(hashed2)
    })

    test('should generate a key pair and sign/verify data correctly', () => {
        const {publicKey, privateKey} = generateKeyPair()
        const data = 'Important data'
        const signature = signData(privateKey, data)
        const isVerified = verifySignature(publicKey, data, signature)

        expect(isVerified).toBe(true)
    })

    test('should fail to verify data with incorrect signature', () => {
        const {publicKey, privateKey} = generateKeyPair()
        const data = 'Important data'
        const signature = signData(privateKey, data)

        const {publicKey: wrongPublicKey} = generateKeyPair()
        const isVerified = verifySignature(wrongPublicKey, data, signature)

        expect(isVerified).toBe(false)
    })
})
