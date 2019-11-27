/* Import faunaDB sdk */
const faunadb = require('faunadb')
import { getId } from './utils/getId'

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

exports.handler = (event, context) => {
  const id = getId(event.path)
  console.log(`Function 'contact-read' invoked. Read id: ${id}`)
  return client.query(q.Get(q.Ref(`classes/contacts/${id}`)))
    .then((response) => {
      console.log('success', response)
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
