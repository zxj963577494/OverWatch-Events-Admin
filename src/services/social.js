import Bmob from 'hydrogen-js-sdk'

export async function postSocial(payload, id) {
  if (payload.length > 0) {
    const queryArray = []
    payload.forEach(item => {
      const queryObj = Bmob.Query('SocialAccount')
      queryObj.set('playerId', id)
      queryObj.set('account', item.account)
      queryObj.set('url', item.url)
      queryArray.push(queryObj)
    })
    return Bmob.Query('SocialAccount').saveAll(queryArray)
  }
  return false
}

export async function removeSocial(payload) {
  const query = Bmob.Query('SocialAccount')
  const { objectId } = payload
  query.equalTo('playerId', '==', objectId)
  return query.find().then(todos => {
    if (todos.length > 0) {
      return todos.destroyAll()
    }
  })
}
