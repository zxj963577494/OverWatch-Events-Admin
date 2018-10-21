import {
  getHeroesById,
  getHeroesByName,
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
      current: {},
    },
  },

  effects: {
    *fetchById({ payload, callback }, { call, put }) {
      const response = yield call(getHeroesById, payload.id)
      yield put({
        type: 'putCurrent',
        payload: response.data,
      })
      if (callback) callback(response)
    },
    *fetchByName({ payload, callback }, { call }) {
      const response = yield call(getHeroesByName, payload.name)
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
      const response = yield call(removeHeroes, payload.id)
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
          },
        },
      }
    },
  },
}
