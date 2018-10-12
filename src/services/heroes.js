import { stringify } from 'qs'
import request from '@/utils/request'

export async function getHeroes(params) {
  return request(`/api/v1/heroes?${stringify(params)}`)
}

export async function getHeroesById(id) {
  return request(`/api/v1/heroes/${id}`)
}

export async function getHeroesByPage(payload) {
  return request(`/api/v1/heroes?${stringify(payload)}`)
}

export async function postHeroes(payload) {
  return request('/api/v1/heroes', {
    method: 'POST',
    body: {
      ...payload,
    },
  })
}

export async function putHeroes(id, params) {
  return request(`/api/v1/heroes/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}

export async function removeHeroes(id) {
  return request(`/api/v1/heroes/${id}`, {
    method: 'DELETE',
  })
}
