import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { List, Card, Button, Avatar, Form, Input, message } from 'antd'

import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { HERO_ROLE } from '@/constant'

import styles from './style.less'

const { Search } = Input

@connect(({ hero, loading }) => ({
  hero,
  loading: loading.models.hero,
}))
@Form.create()
class BasicList extends PureComponent {
  state = {}

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'hero/fetch',
      payload: {},
    })
  }

  navigatorTo = path => {
    const { dispatch } = this.props
    dispatch(routerRedux.push(path))
  }

  handleRemove = item => {
    const {
      dispatch,
      hero: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'hero/remove',
      payload: {
        id: item.id,
      },
      callback: () => {
        dispatch({
          type: 'hero/fetch',
          payload: { ...pagination, currentPage: pagination.current },
        })
      },
    })
    message.success('移除成功')
  }

  handleSearch = value => {
    const { dispatch } = this.props
    dispatch({
      type: 'hero/fetch',
      payload: {
        search: value,
      },
    })
  }

  render() {
    const {
      hero: {
        data: { list, pagination },
      },
      loading,
    } = this.props

    const ListContent = ({ data: { role, health, armour, shield } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>定位</span>
          <p>{HERO_ROLE.filter(x => x.value === role)[0].text}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>生命值</span>
          <p>{health}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>护甲值</span>
          <p>{armour}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>护盾值</span>
          <p>{shield}</p>
        </div>
      </div>
    )

    const extraContent = (
      <div className={styles.extraContent}>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入英雄名称"
          onSearch={this.handleSearch}
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
          type: 'hero/fetch',
          payload: {
            currentPage,
            pageSize,
          },
        })
      },
      onShowSizeChange: (currentPage, pageSize) => {
        const { dispatch } = this.props
        dispatch({
          type: 'hero/fetch',
          payload: {
            currentPage,
            pageSize,
          },
        })
      },
    }
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="英雄列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.navigatorTo('/hero/create')}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component)
                /* eslint-enable */
              }}
            >
              添加英雄
            </Button>
            <List
              size="large"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault()
                        this.navigatorTo(`/hero/edit/${item.id}`)
                      }}
                    >
                      编辑
                    </a>,
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
                    avatar={<Avatar src={item.avatar} shape="square" size="large" />}
                    title={<a href={`/hero/edit/${item.id}`}>{item.cnname}</a>}
                    description={item.remark || item.description}
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
