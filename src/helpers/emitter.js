import mitt from 'mitt'

export let emitt = mitt()
const lockedListeners = []

export const listen = (event, fn, lock = false) => {
  event = Array.isArray(event) ? event : [event]
  for (const e of event) {
    emitt.on(e, fn)
    lock && lockedListeners.push([event, fn])
  }
}

export const event = (event, args) => {
  emitt.emit(event, args)
}

let fns = []
export const runAfterPageChanged = (fn) => {
  fns.push(fn)
}

let fns2 = []
export const runAfterPageLoaded = (fn) => {
  fns2.push(fn)
}

let fns3 = []
export const runBeforeMajraInit = (fn) => {
  fns3.push(fn)
}

export const clear = (callback) => {
  emitt.all.clear()
  callback && callback()
  listen('beforeMajraInit', (args) => {
    fns3.forEach((fn) => fn(args))
    fns3 = []
  })
  listen('majraMounted', (args) => {
    fns.forEach((fn) => fn(args))
    fns = []
  })
  listen('majraDataLoaded', (args) => {
    fns2.forEach((fn) => fn(args))
    fns2 = []
  })
  for (let listener of lockedListeners) listen(listener[0], listener[1])
}

export const emitter = {
  emitt,
  listen,
  event,
  runAfterPageChanged,
  runAfterPageLoaded,
  runBeforeMajraInit,
  clear
}
