import Bmob from 'hydrogen-js-sdk'
import { bouncer } from '@/utils/utils'

export async function getPlayers() {
  const query = Bmob.Query('Player')
  return query.find()
}

export async function getPlayersById(payload) {
  const { id } = payload
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
  bouncer(params).forEach(data => {
    query.set(data.key, data.value)
  })
  return query.save()
}

export async function removePlayers(payload) {
  const query = Bmob.Query('Player')
  const { objectId } = payload
  return query.destroy(objectId)
}

export async function relationGetPlayersSocial(payload) {
  const { id } = payload
  const query = Bmob.Query('Player')
  query.field('player_socials', id)
  return query.relation('SocialAccount').then(res => {
    return res.results
  })
}

export async function relationAddPlayersSocial(payload) {
  const { playerId, socialIds } = payload
  const relation = Bmob.Relation('SocialAccount')
  const relID = relation.add(socialIds)
  const query = Bmob.Query('Player')
  return query.get(playerId).then(res => {
    res.set('player_socials', relID)
    return res.save()
  })
}

export async function relationRemovePlayersSocial(payload) {
  const { playerId, socialIds } = payload
  const relation = Bmob.Relation('SocialAccount')
  const relID = relation.remove(socialIds)
  const query = Bmob.Query('Player')
  return query.get(playerId).then(res => {
    res.set('player_socials', relID)
    return res.save()
  })
}

export async function relationAddPlayersHero(payload) {
  const { playerId, heroIds } = payload
  const relation = Bmob.Relation('Hero')
  const relID = relation.add(heroIds)
  const query = Bmob.Query('Player')
  return query.get(playerId).then(res => {
    res.set('player_heros', relID)
    return res.save()
  })
}

export async function relationRemovePlayersHero(payload) {
  const { playerId, heroIds } = payload
  const relation = Bmob.Relation('Hero')
  const relID = relation.remove(heroIds)
  const query = Bmob.Query('Player')
  return query.get(playerId).then(res => {
    res.set('player_heros', relID)
    return res.save()
  })
}
