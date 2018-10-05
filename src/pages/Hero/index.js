import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'dva'
import { List, Card, Input, Button, Avatar, Modal, Form, Radio, message } from 'antd'

import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import Result from '@/components/Result'
import { HERO_ROLE } from '@/constant'

import styles from './index.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { Search, TextArea } = Input

@connect(({ hero, loading }) => ({
  hero,
  loading: loading.models.hero,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false, isAdd: true }

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

  showModal = () => {
    this.setState({
      visible: true,
      current: {},
      isAdd: true,
    })
  }

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
      isAdd: false,
    })
  }

  handleDone = () => {
    const {
      dispatch,
      hero: {
        data: { pagination },
      },
    } = this.props
    setTimeout(() => this.addBtn.blur(), 0)
    this.setState({
      done: false,
      visible: false,
    })
    dispatch({
      type: 'hero/fetch',
      payload: {
        params: {},
        pagination,
      },
    })
  }

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0)
    this.setState({
      visible: false,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { dispatch, form } = this.props
    const { current, isAdd } = this.state
    const id = current ? current.objectId : ''

    setTimeout(() => this.addBtn.blur(), 0)

    form.validateFields((err, fieldsValue) => {
      if (err) return
      this.setState({
        done: true,
      })
      if (isAdd) {
        dispatch({
          type: 'hero/submit',
          payload: { ...fieldsValue },
        })
      } else {
        dispatch({
          type: 'hero/submit',
          payload: { id, ...fieldsValue },
        })
      }
    })
  }

  deleteItem = id => {
    const { dispatch } = this.props
    dispatch({
      type: 'hero/submit',
      payload: { id },
    })
  }

  handleRemove = item => {
    const { dispatch } = this.props
    dispatch({
      type: 'hero/remove',
      payload: {
        objectId: item.objectId,
      },
      callback: () => {
        dispatch({
          type: 'hero/fetch',
          payload: { pagination: this.pagination },
        })
      },
    })
    message.success('移除成功')
  }

  render() {
    const {
      hero: {
        data: { list, pagination },
      },
      loading,
    } = this.props
    const {
      form: { getFieldDecorator },
    } = this.props
    const { visible, done, current = {}, isAdd } = this.state

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel }

    const extraContent = (
      <div className={styles.extraContent}>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入英雄名称"
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
          type: 'hero/fetch',
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
          type: 'hero/fetch',
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

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        )
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="英雄名称" {...this.formLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入英雄名称' }],
              initialValue: current.name,
            })(<Input placeholder="请输入英雄名称" />)}
          </FormItem>
          <FormItem label="英雄定位" {...this.formLayout}>
            {getFieldDecorator('role', {
              rules: [{ required: true, message: '请选择英雄定位' }],
              initialValue: current.role || 'tank',
            })(
              <RadioGroup>
                {HERO_ROLE.map(x => (
                  <Radio key={x.value} value={x.value}>
                    {x.text}
                  </Radio>
                ))}
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄难度">
            {getFieldDecorator('difficulty', {
              rules: [{ required: true, message: '请选择英雄难度！' }],
              initialValue: current.difficulty || '1',
            })(
              <RadioGroup>
                <Radio key={1} value="1">
                  一星
                </Radio>
                <Radio key={2} value="2">
                  二星
                </Radio>
                <Radio key={3} value="3">
                  三星
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄头像">
            {getFieldDecorator('avatar', {
              initialValue: current.avatar,
              rules: [{ required: true, message: '请输入英雄头像！' }],
            })(<Input placeholder="请输入英雄头像" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄图片">
            {getFieldDecorator('fullshot', {
              initialValue: current.fullshot,
              rules: [{ required: true, message: '请输入英雄图片！' }],
            })(<Input placeholder="请输入英雄图片" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄生命值">
            {getFieldDecorator('health', {
              initialValue: current.health,
            })(<Input placeholder="请输入英雄生命值" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄护甲值">
            {getFieldDecorator('armour', {
              initialValue: current.armour,
            })(<Input placeholder="请输入英雄护甲值" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄护盾值">
            {getFieldDecorator('shield', {
              initialValue: current.shield,
            })(<Input placeholder="请输入英雄护盾值" />)}
          </FormItem>
          <FormItem label="英雄真实姓名" {...this.formLayout}>
            {getFieldDecorator('real_name', {
              rules: [{ required: false, message: '请输入英雄真实姓名' }],
              initialValue: current.real_name,
            })(<Input placeholder="请输入英雄真实姓名" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄年龄">
            {getFieldDecorator('age', {
              initialValue: current.age,
            })(<Input placeholder="请输入英雄年龄" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄身高">
            {getFieldDecorator('height', {
              initialValue: current.height,
            })(<Input placeholder="请输入英雄身高" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄职业">
            {getFieldDecorator('profession', {
              initialValue: current.profession,
            })(<Input placeholder="请输入英雄职业" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄行动基地">
            {getFieldDecorator('base_of_operations', {
              initialValue: current.base_of_operations,
            })(<Input placeholder="请输入英雄行动基地" />)}
          </FormItem>
          <FormItem label="英雄台词" {...this.formLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: false, message: '请输入英雄台词' }],
              initialValue: current.remark,
            })(<Input placeholder="请输入英雄台词" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="英雄描述">
            {getFieldDecorator('description', {
              rules: [{ message: '请输入英雄描述！', min: 5 }],
              initialValue: current.description,
            })(<TextArea rows={4} placeholder="请输入英雄描述" />)}
          </FormItem>
        </Form>
      )
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
              onClick={this.showModal}
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
                        this.showEditModal(item)
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
                    title={<a href={item.href}>{item.name}</a>}
                    description={item.remark}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `英雄${isAdd ? '添加' : '编辑'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    )
  }
}

export default BasicList
