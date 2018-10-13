import {
  getHeroesById,
  getHeroesByPage,
  getHeroes,
  postHeroes,
  putHeroes,
  removeHeroes,
} from '@/services/heroes'

export default {
  namespace: 'hero',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
    },
  },

  effects: {
    *fetchById({ payload, callback }, { call }) {
      const response = yield call(getHeroesById, payload.id)
      if (callback) callback(response)
    },
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(getHeroes, { ...payload, isPaging: 0 })
      yield put({
        type: 'show',
        payload: response.data,
      })
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getHeroesByPage, payload)
      yield put({
        type: 'show',
        payload: response.data,
      })
    },
    *add({ payload, callback }, { call }) {
      yield call(postHeroes, payload)
      if (callback) {
        callback()
      }
    },
    *edit({ payload, callback }, { call }) {
      yield call(putHeroes, payload.id, payload.params)
      if (callback) {
        callback()
      }
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeHeroes, payload.id)
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
  },
}
