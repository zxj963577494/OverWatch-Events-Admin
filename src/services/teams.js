import Bmob from 'hydrogen-js-sdk'
import { bouncer } from '@/utils/utils'

export async function getTeams() {
  const query = Bmob.Query('Team')
  return query.find()
}

export async function getTeamsById(payload) {
  const { id } = payload
  const query = Bmob.Query('Team')
  return query.get(id)
}

export async function getTotal() {
  const query = Bmob.Query('Team')
  return query.count()
}

export async function getTeamsByPage(payload, pagination) {
  const query = Bmob.Query('Team')

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

export async function postTeams(payload) {
  const query = Bmob.Query('Team')
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

export async function removeTeams(payload) {
  const query = Bmob.Query('Team')
  const { objectId } = payload
  return query.destroy(objectId)
}

export async function relationGetTeamsSocial(payload) {
  const { id } = payload
  const query = Bmob.Query('Team')
  query.field('teams_socials', id)
  return query.relation('SocialAccount').then(res => {
    return res.results
  })
}

export async function relationAddTeamsSocial(payload) {
  const { teamId, socialIds } = payload
  const relation = Bmob.Relation('SocialAccount')
  const relID = relation.add(socialIds)
  const query = Bmob.Query('Team')
  return query.get(teamId).then(res => {
    res.set('teams_socials', relID)
    return res.save()
  })
}

export async function relationRemoveTeamsSocial(payload) {
  const { teamId, socialIds } = payload
  const relation = Bmob.Relation('SocialAccount')
  const relID = relation.remove(socialIds)
  const query = Bmob.Query('Team')
  return query.get(teamId).then(res => {
    res.set('teams_socials', relID)
    return res.save()
  })
}

export async function relationAddTeamsPlayer(payload) {
  const { teamId, playerIds } = payload
  const relation = Bmob.Relation('Player')
  const relID = relation.add(playerIds)
  const query = Bmob.Query('Team')
  return query.get(teamId).then(res => {
    res.set('team_players', relID)
    return res.save()
  })
}

export async function relationRemoveTeamsPlayer(payload) {
  const { teamId, playerIds } = payload
  const relation = Bmob.Relation('Player')
  const relID = relation.remove(playerIds)
  const query = Bmob.Query('Team')
  return query.get(teamId).then(res => {
    res.set('team_players', relID)
    return res.save()
  })
}
