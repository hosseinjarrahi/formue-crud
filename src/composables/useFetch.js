function get(url, headers = {}) {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      ...headers
    }
  }
  return fetch(url, options)
}

function post(url, data, headers = {}) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      ...headers
    },
    body: JSON.stringify(data)
  }
  return fetch(url, options)
}

function patch(url, data, headers = {}) {
  const options = {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      ...headers
    },
    body: JSON.stringify(data)
  }
  return fetch(url, options)
}

function remove(url, headers = {}) {
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      ...headers
    }
  }
  return fetch(url, options)
}

export function useFetch() {
  return {
    get,
    post,
    patch,
    remove
  }
}
