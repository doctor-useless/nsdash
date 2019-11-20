/* Api methods to call /functions */

const create = (data) => {
  return fetch('/.netlify/functions/contacts-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAll = () => {
  return fetch('/.netlify/functions/contacts-read-all').then((response) => {
    return response.json()
  })
}

const update = (contactId, data) => {
  return fetch(`/.netlify/functions/contacts-update/${contactId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deleteContact = (contactId) => {
  return fetch(`/.netlify/functions/contacts-delete/${contactId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

const batchDeleteContact = (contactIds) => {
  return fetch(`/.netlify/functions/contacts-delete-batch`, {
    body: JSON.stringify({
      ids: contactIds
    }),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

export default {
  create: create,
  readAll: readAll,
  update: update,
  delete: deleteContact,
  batchDelete: batchDeleteContact
}
