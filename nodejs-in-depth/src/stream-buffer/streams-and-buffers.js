const {Readable, Writable, Transform} = require('stream')

// 1. Basic Readable Stream
class SimpleStream extends Readable {
  #count = 0

  _read(size) {
    setImmediate(() => {
      if (this.#count < 5) {
        this.push(`Message ${this.#count++}\n`)
      } else {
        this.push(null)
      }
    })
  }
}

// 2. Writable Stream
class ConsoleWritable extends Writable {
  _write(chunk, encoding, callback) {
    console.log('Writable:', chunk.toString())
    callback()
  }
}

// 3. Transform Stream
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
}

// 4. Combining Streams
const combineStreams = () => {
  const readable = new Readable({
    read(size) {
      this.push('hello ')
      this.push('world!')
      this.push(null)
    }
  })

  const transform = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase())
      callback()
    }
  })

  const writable = new Writable({
    write(chunk, encoding, callback) {
      console.log('Output:', chunk.toString())
      callback()
    }
  })

  readable.pipe(transform).pipe(writable)
}

// 5. Buffer Example
const bufferExamples = () => {
  const buffer = Buffer.from('Hello, world!')
  console.log('Buffer:', buffer.toString())
  console.log('Buffer length:', buffer.length)

  const buffer2 = Buffer.alloc(10) // Allocate a new buffer with 10 bytes
  buffer2.write('Data')
  console.log('Buffer2:', buffer2.toString())
}

const main = () => {
  console.log('Running SimpleStream example:')
  const simpleStream = new SimpleStream()
  simpleStream.on('data', (chunk) => {
    console.log('Data:', chunk.toString())
  })
  simpleStream.on('end', () => {
    console.log('Stream ended')
  })

  console.log('\nRunning ConsoleWritable example:')
  const writableStream = new ConsoleWritable()
  writableStream.write('Hello, ')
  writableStream.write('world!\n')
  writableStream.end()

  console.log('\nRunning UpperCaseTransform example:')
  process.stdin.pipe(new UpperCaseTransform()).pipe(process.stdout)

  console.log('\nRunning Combined Streams example:')
  combineStreams()

  console.log('\nRunning Buffer examples:')
  bufferExamples()
}

main()

module.exports = {
  SimpleStream
}
