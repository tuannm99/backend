//    ┌───────────────────────────┐
// ┌─>│           timers          │
// │  └─────────────┬─────────────┘
// │  ┌─────────────┴─────────────┐
// │  │     pending callbacks     │
// │  └─────────────┬─────────────┘
// │  ┌─────────────┴─────────────┐
// │  │       idle, prepare       │
// │  └─────────────┬─────────────┘      ┌───────────────┐
// │  ┌─────────────┴─────────────┐      │   incoming:   │
// │  │           poll            │<─────┤  connections, │
// │  └─────────────┬─────────────┘      │   data, etc.  │
// │  ┌─────────────┴─────────────┐      └───────────────┘
// │  │           check           │
// │  └─────────────┬─────────────┘
// │  ┌─────────────┴─────────────┐
// └──┤      close callbacks      │
//    └───────────────────────────┘

console.log('clg 1')

setTimeout(() => console.log('setimout1'), 0)
setTimeout(() => {
    console.log('setimout2')
    process.nextTick(() => console.log('nextick inside timeout'))
}, 0)
setTimeout(() => console.log('setimout3'), 0)

process.nextTick(() => {
    console.log('❤❤❤ nextTick 1')
})
process.nextTick(() => {
    console.log('❤❤❤ nextTick 2')
    process.nextTick(() => {
        console.log('❤❤❤ nextTick nt3')
    })
})
process.nextTick(() => {
    console.log('❤❤❤ nextTick 3')
})

Promise.resolve().then(() => {
    console.log('❤❤❤ promise 1')
})
Promise.resolve().then(() => {
    console.log('❤❤❤ promise 2')
    process.nextTick(() => {
        console.log('❤❤❤ nextTick p2')
    })
})
Promise.resolve().then(() => {
    console.log('❤❤❤ promise 3')
})

console.log('clg 2')

const fs = require('fs')

fs.readFile(__filename, () => {
    console.log('done readfile')
    setImmediate(() => console.log('setImmediate1 after readfile'))
})

process.nextTick(() => console.log('nextick after readfile'))
Promise.resolve().then(() => {
    console.log('❤❤❤ promise after readfile')
})
setTimeout(() => console.log('setimout1 after readfile'), 0)

for (let i = 0; i < 20000000; i++) {}
