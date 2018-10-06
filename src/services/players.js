import Bmob from 'hydrogen-js-sdk'

export async function getPlayers() {
  const query = Bmob.Query('Player')
  return query.find()
}

export async function getPlayersById(id) {
  const query = Bmob.Query('Player')
  return query.get(id)
}

export async function getTotal() {
  const query = Bmob.Query('Player')
  return query.count()
}

export async function getPlayersByPage(payload, pagination) {
  const query = Bmob.Query('Player')

  const { order = 'updateAt' } = payload

  if (pagination) {
    const { currentPage, pageSize } = pagination
    const skipCount = (currentPage - 1) * pageSize
    query.skip(skipCount)
    query.limit(pageSize)
  }

  query.order(order)

  return query.find()
}

export async function postPlayers(payload) {
  const query = Bmob.Query('Player')
  const params = []
  for (const i in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, i)) {
      params.push({
        key: i,
        value: payload[i],
      })
    }
  }
  params.forEach(data => {
    query.set(data.key, data.value)
  })
  return query.save()
}

export async function removePlayers(payload) {
  const query = Bmob.Query('Player')
  const { objectId } = payload
  return query.destroy(objectId)
}
