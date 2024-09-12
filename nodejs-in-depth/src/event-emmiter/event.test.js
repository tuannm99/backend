const EventEmitter = require('events')

describe('EventEmitter', () => {
    test('should emit and listen to events', () => {
        const emitter = new EventEmitter()

        const eventName = 'testEvent'
        const eventData = {message: 'Hello, World!'}

        const listener = jest.fn()
        emitter.on(eventName, listener)

        emitter.emit(eventName, eventData)

        expect(listener).toHaveBeenCalled()

        expect(listener.mock.calls[0][0]).toEqual(eventData)
    })

    test('should remove event listener', () => {
        const emitter = new EventEmitter()
        const eventName = 'testEvent'
        const listener = jest.fn()

        emitter.on(eventName, listener)
        emitter.off(eventName, listener)

        emitter.emit(eventName)

        expect(listener).not.toHaveBeenCalled()
    })

    test('should handle multiple listeners', () => {
        const emitter = new EventEmitter()
        const eventName = 'testEvent'
        const listener1 = jest.fn()
        const listener2 = jest.fn()

        emitter.on(eventName, listener1)
        emitter.on(eventName, listener2)

        emitter.emit(eventName)

        expect(listener1).toHaveBeenCalled()
        expect(listener2).toHaveBeenCalled()
    })

    test('should handle once listener', () => {
        const emitter = new EventEmitter()
        const eventName = 'testEvent'
        const listener = jest.fn()

        emitter.once(eventName, listener)

        emitter.emit(eventName)
        emitter.emit(eventName)

        expect(listener).toHaveBeenCalledTimes(1)
    })

    test('should emit and listen to events with arguments', () => {
        const emitter = new EventEmitter()
        const eventName = 'userData'
        const userData = {id: 1, name: 'Alice'}
        const listener = jest.fn()

        emitter.on(eventName, listener)
        emitter.emit(eventName, userData)

        expect(listener).toHaveBeenCalled()
        expect(listener.mock.calls[0][0]).toEqual(userData)
    })

    test('should emit multiple events and handle them', () => {
        const emitter = new EventEmitter()
        const eventName1 = 'event1'
        const eventName2 = 'event2'
        const listener1 = jest.fn()
        const listener2 = jest.fn()

        emitter.on(eventName1, listener1)
        emitter.on(eventName2, listener2)

        emitter.emit(eventName1)
        emitter.emit(eventName2)

        expect(listener1).toHaveBeenCalled()
        expect(listener2).toHaveBeenCalled()
    })

    test('should emit events asynchronously', (done) => {
        const emitter = new EventEmitter()
        const eventName = 'asyncEvent'
        const listener = jest.fn()

        emitter.on(eventName, listener)

        setTimeout(() => {
            emitter.emit(eventName)
        }, 100)

        setTimeout(() => {
            expect(listener).toHaveBeenCalled()
            done()
        }, 200)
    })

    test('should handle error events', () => {
        const emitter = new EventEmitter()
        const errorEvent = 'error'
        const errorMessage = 'Something went wrong!'
        const errorListener = jest.fn()

        emitter.on(errorEvent, errorListener)
        emitter.emit(errorEvent, new Error(errorMessage))

        expect(errorListener).toHaveBeenCalled()
        expect(errorListener.mock.calls[0][0]).toBeInstanceOf(Error)
        expect(errorListener.mock.calls[0][0].message).toBe(errorMessage)
    })

    test('should handle custom events and namespaces', () => {
        const emitter = new EventEmitter()
        const customNamespace = 'custom'
        const eventName = 'event'
        const listener = jest.fn()

        emitter.on(`${customNamespace}.${eventName}`, listener)
        emitter.emit(`${customNamespace}.${eventName}`)

        expect(listener).toHaveBeenCalled()
    })
})
