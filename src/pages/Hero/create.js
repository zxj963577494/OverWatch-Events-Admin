import React, { PureComponent } from 'react'
import { Card, Button, Form, Icon, Col, Row, Input, Popover, Radio } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import FooterToolbar from '@/components/FooterToolbar'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './index.less'

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
  remark: '台词',
  description: '描述',
  health: '生命值',
  armour: '护甲值',
  shield: '护盾值',
}

@connect(({ hero, loading }) => ({
  hero,
  submitting: loading.effects['hero/add'],
}))
@Form.create()
class heroCreate extends PureComponent {
  state = {
    width: '100%',
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'hero/fetchAll',
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
    } = this.props
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        dispatch({
          type: 'hero/add',
          payload: {
            ...values,
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
      submitting,
    } = this.props
    const { width } = this.state
    return (
      <PageHeaderWrapper title="新建英雄" content="新建英雄。" wrapperClassName={styles.heroCreate}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入英文名称' }],
                  })(<Input placeholder="请输入英文名称" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.cnname}>
                  {getFieldDecorator('cnname', {
                    rules: [{ required: true, message: '请输入中文名称' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入中文名称" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.role}>
                  {getFieldDecorator('role', {
                    initialValue: 'tank',
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
                    rules: [{ required: false, message: '请输入英雄头像' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄头像" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.fullshot}>
                  {getFieldDecorator('fullshot', {
                    rules: [{ required: false, message: '请输入英雄图片' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄图片" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.difficulty}>
                  {getFieldDecorator('difficulty', {
                    initialValue: '1',
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
                    rules: [{ required: false, message: '请输入英雄姓名' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄姓名" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.age}>
                  {getFieldDecorator('age', {
                    rules: [{ required: false, message: '请输入英雄年龄' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄年龄" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.height}>
                  {getFieldDecorator('height', {
                    rules: [{ required: false, message: '请输入英雄身高' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄身高" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.profession}>
                  {getFieldDecorator('profession', {
                    rules: [{ required: false, message: '请选择英雄职业' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄职业" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.base_of_operations}>
                  {getFieldDecorator('base_of_operations', {
                    rules: [{ required: false, message: '请输入英雄行动基地' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄行动基地" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.remark}>
                  {getFieldDecorator('remark', {
                    rules: [{ required: false, message: '请输入英雄台词' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄台词" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.description}>
                  {getFieldDecorator('description', {
                    rules: [{ required: false, message: '请选择英雄描述' }],
                  })(<TextArea style={{ width: '100%' }} rows={4} placeholder="请输入英雄描述" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24} />
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
                    rules: [{ required: false, message: '请输入英雄生命值' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄生命值" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.armour}>
                  {getFieldDecorator('armour', {
                    rules: [{ required: false, message: '请输入英雄护甲值' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄护甲值" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.shield}>
                  {getFieldDecorator('shield', {
                    rules: [{ required: false, message: '请输入英雄护盾值' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入英雄护盾值" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="技能信息" bordered={false} />
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    )
  }
}

export default heroCreate
