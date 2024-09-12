const Bluebird = require('bluebird')

describe('Bluebird Methods', () => {
    test('Promise.resolve should resolve with correct value', async () => {
        const value = 42
        const result = await Bluebird.resolve(value)
        expect(result).toBe(value)
    })

    test('Promise.reject should reject with an error', async () => {
        const errorMessage = 'Error occurred'
        await expect(Bluebird.reject(new Error(errorMessage))).rejects.toThrow(errorMessage)
    })

    test('Promise.all should resolve with an array of results', async () => {
        const promises = [Bluebird.resolve(1), Bluebird.resolve(2), Bluebird.resolve(3)]
        const results = await Bluebird.all(promises)
        expect(results).toEqual([1, 2, 3])
    })
    const Bluebird = require('bluebird')

    test('Bluebird.all should resolve with an array of results', async () => {
        const promises = [Bluebird.resolve(1), Bluebird.resolve(2), Bluebird.resolve(3)]
        const results = await Bluebird.all(promises)
        expect(results).toEqual([1, 2, 3])
    })

    test('Bluebird.each should iterate over items asynchronously', async () => {
        const items = [1, 2, 3]
        const results = []
        await Bluebird.each(items, async (item) => {
            results.push(await Bluebird.resolve(item * 2))
        })
        expect(results).toEqual([2, 4, 6])
    })

    test('Bluebird.map should transform items asynchronously', async () => {
        const items = [1, 2, 3]
        const results = await Bluebird.map(items, async (item) => {
            return await Bluebird.resolve(item * 2)
        })
        expect(results).toEqual([2, 4, 6])
    })

    test('Bluebird.mapSeries should transform items sequentially', async () => {
        const items = [1, 2, 3]
        const results = await Bluebird.mapSeries(items, async (item) => {
            return await Bluebird.resolve(item * 2)
        })
        expect(results).toEqual([2, 4, 6])
    })

    test('Bluebird.map should handle empty array', async () => {
        const items = []
        const results = await Bluebird.map(items, async (item) => {
            return await Bluebird.resolve(item * 2)
        })
        expect(results).toEqual([])
    })

    test('Bluebird.map should handle rejected promises', async () => {
        const items = [1, 2, 3]
        const results = await Bluebird.map(items, async (item) => {
            if (item === 2) {
                return await Bluebird.reject(new Error('Rejected'))
            }
            return await Bluebird.resolve(item * 2)
        }).catch((err) => {
            return [err.message]
        })
        expect(results).toEqual(['Rejected'])
    })

    test('Bluebird.each should handle errors in iteration', async () => {
        const items = [1, 2, 3]
        const results = []
        await Bluebird.each(items, async (item) => {
            if (item === 2) {
                throw new Error('Error in iteration')
            }
            results.push(await Bluebird.resolve(item * 2))
        }).catch((err) => {
            results.push(err.message)
        })
        expect(results).toEqual([2, 'Error in iteration'])
    })
})
