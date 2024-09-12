setImmediate(() => {
    console.log('❤❤❤ tuannm: [index.js][6][setImmediate]')
})

setTimeout(() => {
    console.log('❤❤❤ tuannm: [index.js][6][setTimeout]')
})

// setInterval(() => {
//     console.log('❤❤❤ tuannm: [index.js][14][setInterval]')
// }, 1000)

process.nextTick(() => {
    console.log('❤❤❤ tuannm: [index.js][5][nextTick]')
})
// console.log('❤❤❤ tuannm: [index.js][3][cpus]', cpus)
