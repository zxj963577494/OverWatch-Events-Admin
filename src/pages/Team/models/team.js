import {
  getTeamsById,
  getTeamsByPage,
  getTeams,
  postTeams,
  putTeams,
  removeTeams,
} from '@/services/teams'

export default {
  namespace: 'team',

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
      const response = yield call(getTeamsById, payload.id)
      yield put({
        type: 'putCurrent',
        payload: response.data,
      })
    },
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(getTeams, { ...payload, isPaging: 0 })
      yield put({
        type: 'show',
        payload: response.data,
      })
    },
    *fetch({ payload }, { call, put }) {
      debugger
      const response = yield call(getTeamsByPage, payload)
      yield put({
        type: 'show',
        payload: response.data,
      })
    },
    *add({ payload, callback }, { call }) {
      yield call(postTeams, payload)
      if (callback) {
        callback()
      }
    },
    *edit({ payload, callback }, { call }) {
      yield call(putTeams, payload.id, payload.params)
      if (callback) {
        callback()
      }
    },
    *remove({ payload, callback }, { call }) {
      debugger
      yield call(removeTeams, payload.id)
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
            players: payload.players.map(x => x._id),
          },
        },
      }
    },
  },
}
