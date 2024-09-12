const {Readable} = require('stream')
const SimpleStream = require('./streams-and-buffers').SimpleStream

describe('SimpleStream', () => {
  it('should emit all data chunks', (done) => {
    const testStream = new SimpleStream()

    const expectedData = ['Message 0\n', 'Message 1\n', 'Message 2\n', 'Message 3\n', 'Message 4\n']
    let data = []

    testStream.on('data', (chunk) => {
      data.push(chunk.toString())
    })

    testStream.on('end', () => {
      expect(data).toEqual(expectedData)
      done()
    })
  })
})
