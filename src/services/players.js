import { stringify } from 'qs'
import request from '@/utils/request'

export async function getPlayers(payload) {
  return request(`/api/v1/players?${stringify(payload)}`)
}

export async function getPlayersById(id) {
  return request(`/api/v1/players/${id}`)
}

export async function getPlayersByPage(payload) {
  return request(`/api/v1/players?${stringify(payload)}`)
}

export async function postPlayers(payload) {
  return request('/api/v1/players', {
    method: 'POST',
    body: {
      ...payload,
    },
  })
}

export async function putPlayers(id, params) {
  return request(`/api/v1/players/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}

export async function removePlayers(id) {
  return request(`/api/v1/players/${id}`, {
    method: 'DELETE',
  })
}
