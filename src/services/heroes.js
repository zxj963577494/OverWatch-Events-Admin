import Bmob from 'hydrogen-js-sdk'

export async function getHeroes() {
  const query = Bmob.Query('Hero')
  return query.find()
}

export async function getHeroesById(id) {
  const query = Bmob.Query('Hero')
  return query.get(id)
}

export async function getTotal() {
  const query = Bmob.Query('Hero')
  return query.count()
}

export async function getHeroesByPage(payload, pagination) {
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

export async function postHeroes(payload) {
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

export async function removeHeroes(payload) {
  const query = Bmob.Query('Hero')
  const { objectId } = payload
  return query.destroy(objectId)
}
