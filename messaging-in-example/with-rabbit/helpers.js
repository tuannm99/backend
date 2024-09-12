const msgParser = {
    toBuffer: (obj = {}) => Buffer.from(JSON.stringify(obj)),
    /**
     * @param {Buffer} content
     */
    toObj: (content) => JSON.parse(content.toString())
}

module.exports = {
    msgParser
}
