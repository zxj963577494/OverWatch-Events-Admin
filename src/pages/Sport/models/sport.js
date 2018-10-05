import {
  getSportsById,
  getSportsByPage,
  getTotal,
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
        currentPage: 1,
        pageSize: 10,
      },
    },
  },

  effects: {
    *fetchById({ payload, callback }, { call }) {
      const response = yield call(getSportsById, payload)
      if (callback) callback(response)
    },
    *fetch({ payload }, { call, put, select }) {
      const _pagination = yield select(state => state.sport.data.pagination)
      const page = Object.assign({}, _pagination, payload.pagination)
      const total = yield call(getTotal)
      if (_pagination.total > total && total % page.pageSize === 0) {
        page.currentPage -= 1
      }
      const list = yield call(getSportsByPage, payload, page)
      yield put({
        type: 'show',
        payload: {
          list,
          pagination: {
            ...page,
            total,
          },
        },
      })
    },
    *create({ payload, callback }, { call }) {
      yield call(postSports, payload)
      if (callback) {
        callback()
      }
    },
    *edit({ payload, callback }, { call }) {
      yield call(putSports, payload)
      if (callback) {
        callback()
      }
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeSports, payload)
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
