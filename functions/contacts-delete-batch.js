/* Import faunaDB sdk */
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  // construct batch query from IDs
  const deleteAllCompletedcontactQuery = data.ids.map((id) => {
    return q.Delete(q.Ref(`classes/contacts/${id}`));
  });
  // Hit fauna with the query to delete the completed items
  return client.query(deleteAllCompletedcontactQuery)
    .then((response) => {
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      };
    }).catch((error) => {
      console.log('error', error);
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      };
    });
}
