import Bmob from 'hydrogen-js-sdk'

export async function getHeros() {
  const query = Bmob.Query('Hero')
  return query.find()
}

export async function getHerosById(id) {
  const query = Bmob.Query('Hero')
  return query.get(id)
}

export async function getTotal() {
  const query = Bmob.Query('Hero')
  return query.count()
}

export async function getHerosByPage(payload, pagination) {
  const query = Bmob.Query('Hero')

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

export async function postHeros(payload) {
  const query = Bmob.Query('Hero')
  const params = []
  for (const i in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, i)) {
      if (i !== 'id') {
        params.push({
          key: i,
          value: payload[i],
        })
      }
    }
  }
  params.forEach(data => {
    query.set(data.key, data.value)
  })
  return query.save()
}

export async function putHeros(payload) {
  const query = Bmob.Query('Hero')
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

export async function removeHeros(payload) {
  const query = Bmob.Query('Hero')
  const { objectId } = payload
  return query.destroy(objectId)
}
