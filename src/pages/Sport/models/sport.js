import {
  getSportsById,
  getSportsByPage,
  getSports,
  postSports,
  putSports,
  removeSports,
} from '@/services/sports'

export default {
  namespace: 'sport',

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
      const response = yield call(getSportsById, payload.id)
      if (callback) callback(response)
    },
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(getSports, { ...payload, isPaging: 0 })
      yield put({
        type: 'show',
        payload: response.data,
      })
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getSportsByPage, payload)
      yield put({
        type: 'show',
        payload: response.data,
      })
    },
    *add({ payload, callback }, { call }) {
      yield call(postSports, payload)
      if (callback) {
        callback()
      }
    },
    *edit({ payload, callback }, { call }) {
      yield call(putSports, payload.id, payload.params)
      if (callback) {
        callback()
      }
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeSports, payload.id)
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
