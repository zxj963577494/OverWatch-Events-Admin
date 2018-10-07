import {
  getHeroesById,
  getHeroesByPage,
  getHeroes,
  getTotal,
  postHeroes,
  removeHeroes,
} from '@/services/heroes'

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
      const response = yield call(getHeroesById, payload)
      if (callback) callback(response)
    },
    *fetchAll(_, { call, put }) {
      const response = yield call(getHeroes)
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
      const total = yield call(getTotal)
      const page = Object.assign({}, _pagination, payload.pagination, { total })
      if (_pagination.total > total && total % page.pageSize === 0) {
        page.currentPage -= 1
      }
      const list = yield call(getHeroesByPage, payload, page)
      yield put({
        type: 'show',
        payload: {
          list,
          pagination: page,
        },
      })
    },
    *submit({ payload, callback }, { call }) {
      yield call(postHeroes, payload)
      if (callback) {
        callback()
      }
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeHeroes, payload)
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
