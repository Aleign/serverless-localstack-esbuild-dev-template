
export const webSocketHandler = async (event, context) => {

  const { requestContext: { connectionId, eventType }, headers, body } = event

  let response: any = {
    statusCode: 200,
    body: '',
  }

  console.log('EVENT_TYPE', eventType)
  console.log('connectionId', connectionId)

  try {

    switch(eventType) {
      case 'CONNECT':

        //store your connection id in your database
        break

      case 'MESSAGE':
        //do something with you message

        break

      case 'DISCONNECT':
        //remove connection from db
        break
    }

    return response
  } catch(e: any) {
    console.log('webSocketHandler error', e)

    return {
      statusCode: e?.statusCode || 400,
      body: e?.message
    }
  }
}
