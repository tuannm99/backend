const {AsyncLocalStorage} = require('async_hooks')

class Context {
    static asyncLocalStorage = new AsyncLocalStorage()

    /**
     * @private
     */
    constructor(args = {}) {
        this.args = args
        console.log(args)
    }

    static init(store) {
        let storage = this.asyncLocalStorage.getStore()
        if (!storage) {
            this.asyncLocalStorage.enterWith(store)
            storage = store
        }
        return storage
    }

    static getContext(key) {
        const storage = this.asyncLocalStorage.getStore()
        return storage ? storage[key] : null
    }

    // other utilities
}

module.exports = Context
