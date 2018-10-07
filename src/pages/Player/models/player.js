import {
  getPlayersById,
  getPlayersByPage,
  getPlayers,
  getTotal,
  postPlayers,
  removePlayers,
  relationAddPlayersSocial,
  relationGetPlayersSocial,
  relationAddPlayersHero,
  relationRemovePlayersHero,
} from '@/services/players'
import { postSocial, removeSocial } from '@/services/social'

export default {
  namespace: 'player',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      current: {},
    },
  },

  effects: {
    *fetchById({ payload }, { call, put }) {
      const playerResponse = yield call(getPlayersById, payload)
      const socialResponse = yield call(relationGetPlayersSocial, payload)
      const response = {
        accounts: socialResponse,
        ...playerResponse,
      }
      yield put({
        type: 'putCurrent',
        payload: response,
      })
    },
    *fetchAll(_, { call, put }) {
      const response = yield call(getPlayers)
      yield put({
        type: 'show',
        payload: {
          list: response,
          pagination: {},
        },
      })
    },
    *fetch({ payload }, { call, put, select }) {
      const _pagination = yield select(state => state.player.data.pagination)
      const total = yield call(getTotal)
      const page = Object.assign({}, _pagination, payload.pagination, { total })
      if (_pagination.total > total && total % page.pageSize === 0) {
        page.currentPage -= 1
      }
      const list = yield call(getPlayersByPage, payload, page)
      yield put({
        type: 'show',
        payload: {
          list,
          pagination: page,
        },
      })
    },
    *submit({ payload, callback }, { call }) {
      const { accounts, heroes } = payload
      const player = Object.assign({}, payload)
      delete player.accounts
      const origin = yield call(getPlayersById, payload)
      const playerResponse = yield call(postPlayers, player)
      const playerId = playerResponse.objectId || player.id
      if (player.id || accounts.length > 0) {
        yield call(removeSocial, payload)
        const socialResponse = yield call(postSocial, accounts, playerId)
        if (socialResponse) {
          const socialIds = socialResponse.map(x => x.success.objectId)
          yield call(relationAddPlayersSocial, { playerId, socialIds })
        }
      }
      if (player.id || heroes.length > 0) {
        yield call(relationRemovePlayersHero, { playerId, heroIds: origin.heroes })
        yield call(relationAddPlayersHero, { playerId, heroIds: heroes })
      }
      if (callback) {
        callback()
      }
    },
    *remove({ payload, callback }, { call }) {
      yield call(removePlayers, payload)
      yield call(removeSocial, payload)
      if (callback) {
        callback()
      }
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          list: payload.list.map(x => {
            return {
              ...x,
              key: x.objectId,
            }
          }),
          pagination: payload.pagination,
        },
      }
    },
    putCurrent(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          current: { ...payload, birth: payload.birth && payload.birth.iso },
        },
      }
    },
  },
}
