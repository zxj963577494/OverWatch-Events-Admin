import { getSportsById, getSportsByPage, getTotal, putSports } from '@/services/sports'

export default {
  namespace: 'sport',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
    },
  },

  effects: {
    *getSportsById({ payload, callback }, { call }) {
      const response = yield call(getSportsById, payload)
      if (callback) callback(response)
    },
    *getSportsByPage({ payload }, { call, put, select }) {
      const _pagination = yield select(state => state.sport.data.pagination)
      const total = yield call(getTotal)
      const list = yield call(getSportsByPage, payload, payload.pagination || _pagination)
      yield put({
        type: 'show',
        payload: {
          list,
          pagination: {
            ...payload.pagination,
            total,
          },
        },
      })
    },
    *putSports({ payload }, { call }) {
      yield call(putSports, payload)
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
              startDate: x.startDate.iso,
              endDate: x.endDate.iso,
            }
          }),
          pagination: payload.pagination,
        },
      }
    },
  },
}
