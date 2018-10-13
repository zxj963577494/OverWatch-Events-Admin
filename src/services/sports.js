import { stringify } from 'qs'
import request from '@/utils/request'

export async function getSports(params) {
  return request(`/api/v1/sports?${stringify(params)}`)
}

export async function getSportsById(id) {
  return request(`/api/v1/sports/${id}`)
}

export async function getSportsByPage(payload) {
  return request(`/api/v1/sports?${stringify(payload)}`)
}

export async function postSports(payload) {
  return request('/api/v1/sports', {
    method: 'POST',
    body: {
      ...payload,
    },
  })
}

export async function putSports(id, params) {
  return request(`/api/v1/sports/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}

export async function removeSports(id) {
  return request(`/api/v1/sports/${id}`, {
    method: 'DELETE',
  })
}
