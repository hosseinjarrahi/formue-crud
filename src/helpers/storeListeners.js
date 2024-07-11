export default ({ listen, store }) => {
  listen('reloadData', () => {
    store.reloadData()
  })
}
