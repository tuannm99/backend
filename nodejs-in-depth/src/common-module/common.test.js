const os = require('os')
const path = require('path')
const fs = require('fs')
const {
    getCpuInfo,
    getFreeMemory,
    getTotalMemory,
    getHostname,
    getOSPlatform,
    getOSRelease,
    getOSUptime,
    joinPath,
    getDirname,
    formatPath,
    normalizePath,
    readFileAsync,
    readFileSync,
    writeFileAsync,
    writeFileSync,
    readdirAsync,
    readdirSync,
    deleteFile,
    getEnv,
    getPID,
    getMemoryUsage,
    getArch,
    getArgv
} = require('./lib')

describe('OS Module', () => {
    test('getCpuInfo should return CPU information', () => {
        const cpuInfo = getCpuInfo()
        expect(cpuInfo).toBeDefined()
        expect(Array.isArray(cpuInfo)).toBe(true)
    })

    test('getFreeMemory should return free memory', () => {
        const freeMemory = getFreeMemory()
        expect(freeMemory).toBeDefined()
        expect(typeof freeMemory).toBe('number')
    })

    test('getTotalMemory should return total memory', () => {
        const totalMemory = getTotalMemory()
        expect(totalMemory).toBeDefined()
        expect(typeof totalMemory).toBe('number')
    })

    test('getHostname should return hostname', () => {
        const hostname = getHostname()
        expect(hostname).toBeDefined()
        expect(typeof hostname).toBe('string')
    })

    test('getOSPlatform should return OS platform', () => {
        const platform = getOSPlatform()
        expect(platform).toBeDefined()
        expect(typeof platform).toBe('string')
    })

    test('getOSRelease should return OS release', () => {
        const release = getOSRelease()
        expect(release).toBeDefined()
        expect(typeof release).toBe('string')
    })

    test('getOSUptime should return OS uptime', () => {
        const uptime = getOSUptime()
        expect(uptime).toBeDefined()
        expect(typeof uptime).toBe('number')
    })
})

describe('Path Module', () => {
    test('joinPath should join paths correctly', () => {
        const result = joinPath('/foo', 'bar', 'baz/asdf', 'quux', '..')
        expect(result).toBe(path.join('/foo', 'bar', 'baz/asdf'))
    })

    test('getDirname should return directory name', () => {
        const result = getDirname('/foo/bar/baz/asdf/quux')
        expect(result).toBe(path.dirname('/foo/bar/baz/asdf/quux'))
    })

    test('formatPath should format path correctly', () => {
        const result = formatPath({
            dir: '/home/user/dir',
            base: 'file.txt'
        })
        expect(result).toBe(
            path.format({
                dir: '/home/user/dir',
                base: 'file.txt'
            })
        )
    })

    test('normalizePath should normalize path correctly', () => {
        const result = normalizePath('/foo/bar//baz/asdf/quux/..')
        expect(result).toBe(path.normalize('/foo/bar//baz/asdf/quux/..'))
    })
})

describe('File System Module', () => {
    const testFilePath = path.join(__dirname, 'test.txt')
    const testData = 'Hello, World!'

    afterAll(() => {
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath)
        }
    })

    test('writeFileSync should write data to a file synchronously', () => {
        writeFileSync(testFilePath, testData)
        const data = readFileSync(testFilePath)
        expect(data).toBe(testData)
    })

    test('readFileSync should read data from a file synchronously', () => {
        writeFileSync(testFilePath, testData)
        const data = readFileSync(testFilePath)
        expect(data).toBe(testData)
    })

    test('writeFileAsync should write data to a file asynchronously', (done) => {
        writeFileAsync(testFilePath, testData, (err) => {
            expect(err).toBeNull()
            readFileAsync(testFilePath, (err, data) => {
                expect(err).toBeNull()
                expect(data).toBe(testData)
                done()
            })
        })
    })

    test('readFileAsync should read data from a file asynchronously', (done) => {
        writeFileAsync(testFilePath, testData, (err) => {
            expect(err).toBeNull()
            readFileAsync(testFilePath, (err, data) => {
                expect(err).toBeNull()
                expect(data).toBe(testData)
                done()
            })
        })
    })

    test('readdirSync should read directory contents synchronously', () => {
        const result = readdirSync(__dirname)
        expect(Array.isArray(result)).toBe(true)
    })

    test('readdirAsync should read directory contents asynchronously', (done) => {
        readdirAsync(__dirname, (err, files) => {
            expect(err).toBeNull()
            expect(Array.isArray(files)).toBe(true)
            done()
        })
    })

    test('deleteFile should delete a file', (done) => {
        writeFileAsync(testFilePath, testData, (err) => {
            expect(err).toBeNull()
            deleteFile(testFilePath, (err) => {
                expect(err).toBeNull()
                expect(fs.existsSync(testFilePath)).toBe(false)
                done()
            })
        })
    })
})

describe('Process Module', () => {
    test('getEnv should return environment variable', () => {
        const nodeEnv = getEnv('NODE_ENV')
        expect(nodeEnv).toBeDefined()
    })

    test('getPID should return process id', () => {
        const pid = getPID()
        expect(pid).toBeDefined()
        expect(typeof pid).toBe('number')
    })

    test('getMemoryUsage should return memory usage info', () => {
        const memoryUsage = getMemoryUsage()
        expect(memoryUsage).toBeDefined()
        expect(typeof memoryUsage).toBe('object')
    })

    test('getArch should return architecture', () => {
        const arch = getArch()
        expect(arch).toBeDefined()
        expect(typeof arch).toBe('string')
    })

    test('getArgv should return argument vector', () => {
        const argv = getArgv()
        expect(argv).toBeDefined()
        expect(Array.isArray(argv)).toBe(true)
    })

    test('process.stdin should be defined', () => {
        expect(process.stdin).toBeDefined()
    })

    test('process.stdout should be defined', () => {
        expect(process.stdout).toBeDefined()
    })

    test('process.on should register and trigger an "exit" event', (done) => {
        const handler = jest.fn((code) => {
            expect(code).toBe(0)
        })
        process.on('exit', handler)

        process.emit('exit', 0)

        expect(handler).toHaveBeenCalled()

        // Clean up event listener
        process.off('exit', handler)
        done()
    })

    test('process.on should register and trigger an "uncaughtException" event', (done) => {
        const handler = jest.fn((error) => {
            expect(error).toBeDefined()
            expect(error.message).toBe('Test error')
        })
        process.on('uncaughtException', handler)

        process.emit('uncaughtException', new Error('Test error'))

        expect(handler).toHaveBeenCalled()

        // Clean up event listener
        process.off('uncaughtException', handler)
        done()
    })

    test('process.on should register and trigger a "warning" event', (done) => {
        const handler = jest.fn((warning) => {
            expect(warning).toBeDefined()
            expect(warning.message).toBe('Test warning')
        })
        process.on('warning', handler)

        process.emit('warning', new Error('Test warning'))

        expect(handler).toHaveBeenCalled()

        // Clean up event listener
        process.off('warning', handler)
        done()
    })
})
