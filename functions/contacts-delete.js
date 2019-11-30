const getId = require('./utils/getId');
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

exports.handler = async (event, context) => {
  const id = getId(event.path);
  return client.query(q.Delete(q.Ref(`classes/contacts/${id}`)))
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
