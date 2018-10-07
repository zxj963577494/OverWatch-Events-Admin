import {
  getTeamsById,
  getTeamsByPage,
  getTotal,
  postTeams,
  removeTeams,
  relationAddTeamsSocial,
  relationGetTeamsSocial,
} from '@/services/teams'
import { postSocial, removeSocial } from '@/services/social'

export default {
  namespace: 'team',

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
      const teamResponse = yield call(getTeamsById, payload)
      const socialResponse = yield call(relationGetTeamsSocial, payload)
      const response = {
        accounts: socialResponse,
        ...teamResponse,
      }
      yield put({
        type: 'putCurrent',
        payload: response,
      })
    },
    *fetch({ payload }, { call, put, select }) {
      const _pagination = yield select(state => state.team.data.pagination)
      const total = yield call(getTotal)
      const page = Object.assign({}, _pagination, payload.pagination, { total })
      if (_pagination.total > total && total % page.pageSize === 0) {
        page.currentPage -= 1
      }
      const list = yield call(getTeamsByPage, payload, page)
      yield put({
        type: 'show',
        payload: {
          list,
          pagination: page,
        },
      })
    },
    *submit({ payload, callback }, { call }) {
      const { accounts } = payload
      const team = payload
      delete team.accounts
      const teamResponse = yield call(postTeams, team)
      const teamId = teamResponse.objectId || team.id
      if (accounts.length > 0) {
        yield call(removeSocial, payload)
        const socialResponse = yield call(postSocial, accounts, teamId)
        const socialIds = socialResponse.map(x => x.success.objectId)
        yield call(relationAddTeamsSocial, { teamId, socialIds })
      }
      if (callback) {
        callback()
      }
    },
    *remove({ payload, callback }, { call }) {
      yield call(removeTeams, payload)
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
          current: { ...payload, createdTime: payload.createdTime.iso },
        },
      }
    },
  },
}
