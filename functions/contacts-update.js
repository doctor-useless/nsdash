const getId = require('./utils/getId');
const faunadb = require('faunadb');

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
});

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  const id = getId(event.path);
  console.log(`Function 'contact-update' invoked. update id: ${id}`);
  return client.query(q.Update(q.Ref(`classes/contacts/${id}`), { data }))
    .then((response) => {
      console.log('success', response);
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
