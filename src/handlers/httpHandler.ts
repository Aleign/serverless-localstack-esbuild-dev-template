
export const httpHandler = async (
  event,
  context
) => {

  console.log('EVENT', event)
  console.log('CONTEXT', context)
  try {



    //eg add some cors response headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Hello from Lambda!'
      }),
      isBase64Encoded: false
    }
  } catch(e) {
    return {
      statusCode: e.statusCode,
      body: JSON.stringify({ error: e.message }),
      isBase64Encoded: false
    }
  }
}

