import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { List, Card, Button, Avatar, Form, Input, message } from 'antd'

import globalCountries from '@/utils/countryMap'

import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './index.less'

const { Search } = Input

@connect(({ player, loading }) => ({
  player,
  loading: loading.models.player,
}))
@Form.create()
class BasicList extends PureComponent {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  }

  componentDidMount() {
    const {
      dispatch,
      player: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'player/fetch',
      payload: { ...pagination, currentPage: pagination.current },
    })
  }

  handleRemove = item => {
    const {
      dispatch,
      player: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'player/remove',
      payload: {
        id: item.id,
      },
      callback: () => {
        dispatch({
          type: 'player/fetch',
          payload: { ...pagination, currentPage: pagination.current },
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
      player: {
        data: { list, pagination },
      },
      loading,
    } = this.props

    const extraContent = (
      <div className={styles.extraContent}>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入选手名称"
          onSearch={() => ({})}
        />
      </div>
    )

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
      onChange: (currentPage, pageSize) => {
        const { dispatch } = this.props
        dispatch({
          type: 'player/fetch',
          payload: {
            currentPage,
            pageSize,
          },
        })
      },
      onShowSizeChange: (currentPage, pageSize) => {
        const { dispatch } = this.props
        dispatch({
          type: 'player/fetch',
          payload: {
            currentPage,
            pageSize,
          },
        })
      },
    }

    const ListContent = ({ data: { nationality } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>国家</span>
          <p>{nationality && globalCountries.filter(x => x.code === nationality)[0].cn}</p>
        </div>
      </div>
    )

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="选手列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.navigatorTo('/player/create')}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component)
                /* eslint-enable */
              }}
            >
              添加选手
            </Button>
            <List
              size="large"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => this.navigatorTo(`/player/edit/${item.id}`)}>编辑</a>,
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
                    avatar={<Avatar src={item.headshot} shape="square" size="large" />}
                    title={<a href={`/player/edit/${item.id}`}>{item.name}</a>}
                    description={item.handle}
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
