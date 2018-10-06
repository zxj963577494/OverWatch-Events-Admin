import {
  getHerosById,
  getHerosByPage,
  getHeros,
  getTotal,
  postHeros,
  removeHeros,
} from '@/services/heros'

export default {
  namespace: 'hero',

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
      const response = yield call(getHerosById, payload)
      if (callback) callback(response)
    },
    *fetchAll(_, { call, put }) {
      const response = yield call(getHeros)
      yield put({
        type: 'show',
        payload: {
          list: response,
          pagination: {},
        },
      })
    },
    *fetch({ payload }, { call, put, select }) {
      const _pagination = yield select(state => state.hero.data.pagination)
      const page = Object.assign({}, _pagination, payload.pagination)
      const total = yield call(getTotal)
      if (_pagination.total > total && total % page.pageSize === 0) {
        page.currentPage -= 1
      }
      const list = yield call(getHerosByPage, payload, page)
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
    *submit({ payload, callback }, { call }) {
      yield call(postHeros, payload)
      if (callback) {
        callback()
      }
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeHeros, payload)
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
  },
}
