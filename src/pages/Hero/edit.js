import React, { PureComponent } from 'react'
import { Card, Button, Form, Icon, Col, Row, Input, Popover, Radio, message } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import FooterToolbar from '@/components/FooterToolbar'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import AbilityForm from './AbilityForm'

import styles from './style.less'

import { HERO_ROLE } from '@/constant'

const RadioGroup = Radio.Group
const { TextArea } = Input

const fieldLabels = {
  name: '英文名称',
  cnname: '中文名称',
  role: '定位',
  difficulty: '难度',
  avatar: '头像',
  fullshot: '图片',
  real_name: '姓名',
  age: '年龄',
  height: '身高',
  profession: '职业',
  base_of_operations: '行动基地',
  creed: '信条',
  description: '描述',
  remark: '评价',
  health: '生命值',
  armour: '护甲值',
  shield: '护盾值',
}
@connect(({ hero, loading }) => ({
  hero,
  submitting: loading.effects['hero/edit'],
}))
@Form.create()
class HeroEdit extends PureComponent {
  state = {
    width: '100%',
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    if (!match.params.id) {
      message.error('缺少参数：id')
      setTimeout(() => {
        dispatch(routerRedux.push('/hero/list'))
      }, 1500)
    }
    dispatch({
      type: 'hero/fetchById',
      payload: {
        id: match.params.id,
      },
    })
    window.addEventListener('resize', this.resizeFooterToolbar, {
      passive: true,
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar)
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props
    const errors = getFieldsError()
    const errorCount = Object.keys(errors).filter(key => errors[key]).length
    if (!errors || errorCount === 0) {
      return null
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    }
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      )
    })
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    )
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0]
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`
        const { width: stateWidth } = this.state
        if (stateWidth !== width) {
          this.setState({ width })
        }
      }
    })
  }

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
      hero: {
        data: { current },
      },
    } = this.props
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { id } = current
        dispatch({
          type: 'hero/edit',
          payload: {
            id,
            params: {
              ...values,
            },
          },
          callback: () => {
            dispatch(routerRedux.push('/hero/list'))
          },
        })
      }
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      hero: {
        data: { current },
      },
      submitting,
    } = this.props
    const { width } = this.state
    return (
      <PageHeaderWrapper
        title={`${current.id ? '编辑' : '新建'}英雄`}
        content={`${current.id ? '编辑' : '新建'}英雄`}
        wrapperClassName={styles.advancedForm}
      >
        <div className={styles.standardList}>
          <Card title="基本信息" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      initialValue: current.name || '',
                      rules: [{ required: true, message: '请输入英文名称' }],
                    })(<Input placeholder="请输入英文名称" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.cnname}>
                    {getFieldDecorator('cnname', {
                      initialValue: current.cnname || '',
                      rules: [{ required: true, message: '请输入中文名称' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入中文名称" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabels.role}>
                    {getFieldDecorator('role', {
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
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.avatar}>
                    {getFieldDecorator('avatar', {
                      initialValue: current.avatar || '',
                      rules: [{ required: false, message: '请输入英雄头像' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄头像" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.fullshot}>
                    {getFieldDecorator('fullshot', {
                      initialValue: current.fullshot || '',
                      rules: [{ required: false, message: '请输入英雄图片' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄图片" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabels.difficulty}>
                    {getFieldDecorator('difficulty', {
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
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.real_name}>
                    {getFieldDecorator('real_name', {
                      initialValue: current.real_name || '',
                      rules: [{ required: false, message: '请输入英雄姓名' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄姓名" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.age}>
                    {getFieldDecorator('age', {
                      initialValue: current.age || '',
                      rules: [{ required: false, message: '请输入英雄年龄' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄年龄" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabels.height}>
                    {getFieldDecorator('height', {
                      initialValue: current.height || '',
                      rules: [{ required: false, message: '请输入英雄身高' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄身高" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.profession}>
                    {getFieldDecorator('profession', {
                      initialValue: current.profession || '',
                      rules: [{ required: false, message: '请选择英雄职业' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄职业" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.base_of_operations}>
                    {getFieldDecorator('base_of_operations', {
                      initialValue: current.base_of_operations || '',
                      rules: [{ required: false, message: '请输入英雄行动基地' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄行动基地" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabels.creed}>
                    {getFieldDecorator('creed', {
                      initialValue: current.creed,
                      rules: [{ required: false, message: '请输入英雄信条' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄信条" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.description}>
                    {getFieldDecorator('description', {
                      initialValue: current.description || '',
                      rules: [{ required: false, message: '请选择英雄描述' }],
                    })(
                      <TextArea style={{ width: '100%' }} rows={4} placeholder="请输入英雄描述" />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.remark}>
                    {getFieldDecorator('remark', {
                      initialValue: current.remark || '',
                      rules: [{ required: false, message: '请输入英雄评价' }],
                    })(
                      <TextArea style={{ width: '100%' }} rows={4} placeholder="请输入英雄评价" />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24} />
              </Row>
            </Form>
          </Card>
          <Card title="游戏信息" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.health}>
                    {getFieldDecorator('health', {
                      initialValue: current.health || '',
                      rules: [{ required: false, message: '请输入英雄生命值' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄生命值" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label={fieldLabels.armour}>
                    {getFieldDecorator('armour', {
                      initialValue: current.armour || '',
                      rules: [{ required: false, message: '请输入英雄护甲值' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄护甲值" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label={fieldLabels.shield}>
                    {getFieldDecorator('shield', {
                      initialValue: current.shield || '',
                      rules: [{ required: false, message: '请输入英雄护盾值' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄护盾值" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="技能信息" bordered={false}>
            {getFieldDecorator('abilities', {
              initialValue: current.abilities || [],
            })(<AbilityForm />)}
          </Card>
          <FooterToolbar style={{ width }}>
            {this.getErrorInfo()}
            <Button type="primary" onClick={this.validate} loading={submitting}>
              提交
            </Button>
          </FooterToolbar>
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default HeroEdit
