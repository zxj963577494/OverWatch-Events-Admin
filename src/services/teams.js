import { stringify } from 'qs'
import request from '@/utils/request'

export async function getTeams(payload) {
  return request(`/api/v1/teams?${stringify(payload)}`)
}

export async function getTeamsById(id) {
  return request(`/api/v1/teams/${id}`)
}

export async function getTeamsByPage(payload) {
  return request(`/api/v1/teams?${stringify(payload)}`)
}

export async function postTeams(payload) {
  return request('/api/v1/teams', {
    method: 'POST',
    body: {
      ...payload,
    },
  })
}

export async function putTeams(id, params) {
  return request(`/api/v1/teams/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}

export async function removeTeams(id) {
  debugger
  return request(`/api/v1/teams/${id}`, {
    method: 'DELETE',
  })
}
