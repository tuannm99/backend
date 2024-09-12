const os = require('os')
const path = require('path')
const fs = require('fs')

// OS methods
const getCpuInfo = () => os.cpus()
const getFreeMemory = () => os.freemem()
const getTotalMemory = () => os.totalmem()
const getHostname = () => os.hostname()
const getOSPlatform = () => os.platform()
const getOSRelease = () => os.release()
const getOSUptime = () => os.uptime()

// Path methods
const joinPath = (...args) => path.join(...args)
const getDirname = (p) => path.dirname(p)
const formatPath = (p) => path.format(p)
const normalizePath = (p) => path.normalize(p)

// FS methods
const readFileAsync = (filePath, callback) => {
    fs.readFile(filePath, 'utf8', callback)
}

const readFileSync = (filePath) => {
    return fs.readFileSync(filePath, 'utf8')
}

const writeFileAsync = (filePath, data, callback) => {
    fs.writeFile(filePath, data, 'utf8', callback)
}

const writeFileSync = (filePath, data) => {
    fs.writeFileSync(filePath, data, 'utf8')
}

const readdirAsync = (dirPath, callback) => {
    fs.readdir(dirPath, callback)
}

const readdirSync = (dirPath) => {
    return fs.readdirSync(dirPath)
}

const deleteFile = (filePath, callback) => {
    fs.unlink(filePath, callback)
}

// Process methods
const getEnv = (key) => process.env[key]
const getPID = () => process.pid
const getMemoryUsage = () => process.memoryUsage()
const getArch = () => process.arch
const getArgv = () => process.argv

module.exports = {
    // OS methods
    getCpuInfo,
    getFreeMemory,
    getTotalMemory,
    getHostname,
    getOSPlatform,
    getOSRelease,
    getOSUptime,
    // Path methods
    joinPath,
    getDirname,
    formatPath,
    normalizePath,
    // FS methods
    readFileAsync,
    readFileSync,
    writeFileAsync,
    writeFileSync,
    readdirAsync,
    readdirSync,
    deleteFile,
    // Process methods
    getEnv,
    getPID,
    getMemoryUsage,
    getArch,
    getArgv
}
