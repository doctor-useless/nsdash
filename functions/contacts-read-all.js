/* Import faunaDB sdk */
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

exports.handler = async (event, context) => {
  return client.query(q.Paginate(q.Match(q.Ref('indexes/all_contacts'))))
    .then((response) => {
      const contactRefs = response.data
      console.log('contact refs', contactRefs)
      console.log(`${contactRefs.length} contacts found`)
      // create new query out of contact refs. http://bit.ly/2LG3MLg
      const getAllcontactDataQuery = contactRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllcontactDataQuery).then((ret) => {
        return {
          statusCode: 200,
          body: JSON.stringify(ret)
        }
      })
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
