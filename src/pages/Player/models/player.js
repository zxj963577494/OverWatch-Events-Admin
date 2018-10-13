import {
  getPlayersById,
  getPlayersByPage,
  getPlayers,
  postPlayers,
  putPlayers,
  removePlayers,
} from '@/services/players'

export default {
  namespace: 'player',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      current: {},
    },
  },

  effects: {
    *fetchById({ payload }, { call, put }) {
      const response = yield call(getPlayersById, payload.id)
      yield put({
        type: 'putCurrent',
        payload: response.data,
      })
    },
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(getPlayers, { ...payload, isPaging: 0 })
      yield put({
        type: 'show',
        payload: response.data,
      })
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getPlayersByPage, payload)
      yield put({
        type: 'show',
        payload: response.data,
      })
    },
    *add({ payload, callback }, { call }) {
      yield call(postPlayers, payload)
      if (callback) {
        callback()
      }
    },
    *edit({ payload, callback }, { call }) {
      yield call(putPlayers, payload.id, payload.params)
      if (callback) {
        callback()
      }
    },
    *remove({ payload, callback }, { call }) {
      yield call(removePlayers, payload.id)
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
          ...payload,
        },
      }
    },
    putCurrent(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          current: {
            ...payload,
            id: payload._id,
            heroes: payload.heroes.map(x => x._id),
          },
        },
      }
    },
  },
}
