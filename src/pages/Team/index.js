import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { List, Card, Button, Avatar, Form, Input, Badge, message } from 'antd'

import globalCountries from '@/utils/countryMap'
import { SPORT_RANK, TEAM_STATUS } from '@/constant'

import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './index.less'

const { Search } = Input

@connect(({ team, loading }) => ({
  team,
  loading: loading.models.team,
}))
@Form.create()
class BasicList extends PureComponent {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'team/fetch',
      payload: {},
    })
  }

  handleRemove = item => {
    const { dispatch } = this.props
    dispatch({
      type: 'team/remove',
      payload: {
        objectId: item.objectId,
      },
      callback: () => {
        dispatch({
          type: 'team/fetch',
          payload: { pagination: this.pagination },
        })
      },
    })
    message.success('移除成功')
  }

  navigatorTo = path => {
    const { dispatch } = this.props
    dispatch(routerRedux.push(path))
  }

  render() {
    const {
      team: {
        data: { list, pagination },
      },
      loading,
    } = this.props

    const extraContent = (
      <div className={styles.extraContent}>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入队伍名称"
          onSearch={() => ({})}
        />
      </div>
    )

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
      onChange: (page, pageSize) => {
        const { dispatch } = this.props
        this.pagination = {
          currentPage: page,
          pageSize,
        }
        dispatch({
          type: 'team/fetch',
          payload: {
            params: {},
            pagination: {
              currentPage: this.pagination.currentPage,
              pageSize: this.pagination.pageSize,
            },
          },
        })
      },
      onShowSizeChange: (current, size) => {
        const { dispatch } = this.props
        this.pagination = {
          currentPage: current,
          pageSize: size,
        }
        dispatch({
          type: 'team/fetch',
          payload: {
            params: {},
            pagination: {
              currentPage: this.pagination.currentPage,
              pageSize: this.pagination.pageSize,
            },
          },
        })
      },
    }

    const ListContent = ({ data: { addressCountry, rank, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>状态</span>
          <p>
            <Badge
              status={status && TEAM_STATUS.filter(x => x.value === status)[0].status}
              text={status && TEAM_STATUS.filter(x => x.value === status)[0].text}
            />
          </p>
        </div>
        <div className={styles.listContentItem}>
          <span>级别</span>
          <p>{rank && SPORT_RANK.filter(x => x.value === rank)[0].text}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>国家</span>
          <p>{addressCountry && globalCountries.filter(x => x.code === addressCountry)[0].cn}</p>
        </div>
      </div>
    )

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="队伍列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.navigatorTo('/team/create')}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component)
                /* eslint-enable */
              }}
            >
              添加队伍
            </Button>
            <List
              size="large"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => this.navigatorTo(`/team/edit/${item.objectId}`)}>编辑</a>,
                    <a
                      onClick={e => {
                        e.preventDefault()
                        this.handleRemove(item)
                      }}
                    >
                      移除
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={
                      <a href={`/team/edit/${item.objectId}`}>
                        {item.name}({item.abbreviatedName})
                      </a>
                    }
                    description={item.description}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default BasicList
