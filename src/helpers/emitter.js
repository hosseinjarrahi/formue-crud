import mitt from 'mitt'

class EmitterSingleton {
  constructor() {
    if (EmitterSingleton.instance) {
      return EmitterSingleton.instance
    }

    this.emitt = mitt()
    this.lockedListeners = []
    this.fns = []
    this.fns2 = []
    this.fns3 = []

    EmitterSingleton.instance = this
  }

  listen(event, fn, lock = false) {
    event = Array.isArray(event) ? event : [event]
    for (const e of event) {
      this.emitt.on(e, fn)
      if (lock) this.lockedListeners.push([event, fn])
    }
  }

  event(event, args) {
    this.emitt.emit(event, args)
  }

  runAfterPageChanged(fn) {
    this.fns.push(fn)
  }

  runAfterPageLoaded(fn) {
    this.fns2.push(fn)
  }

  runBeforeMajraInit(fn) {
    this.fns3.push(fn)
  }

  clear(callback) {
    this.emitt.all.clear()
    if (callback) callback()

    this.listen('beforeMajraInit', (args) => {
      this.fns3.forEach((fn) => fn(args))
      this.fns3 = []
    })

    this.listen('majraMounted', (args) => {
      this.fns.forEach((fn) => fn(args))
      this.fns = []
    })

    this.listen('majraDataLoaded', (args) => {
      this.fns2.forEach((fn) => fn(args))
      this.fns2 = []
    })

    for (let listener of this.lockedListeners) {
      this.listen(listener[0], listener[1])
    }
  }
}

// create and export a single shared instance
const emitter = new EmitterSingleton()

export const setEmitter = (inputEmitter) => {
  Object.assign(emitter, inputEmitter)
}

export { emitter }
