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
  remark: '台词',
  description: '描述',
  health: '生命值',
  armour: '护甲值',
  shield: '护盾值',
}

const tableData = [
  {
    key: '1',
    abilityLogo:
      'http://overwatch.nos.netease.com/1/assets/images/hero/dva/ability-fusion-cannons/icon-ability.png',
    abilityName: '机甲：聚变机炮',
    abilityDescription:
      'D．Va的机甲装备有两台近距离旋转机炮。它们可以在不重新装填的情况下进行持续高伤害的火力输出，但使用时会降低D.Va的移动速度。',
    abilityProperty: [
      {
        name: 'Type',
        value: 'Rapid Fire Shotgun',
        cnName: '类型',
        cnValue: '速射机枪',
      },
      {
        name: 'Damage',
        value: '0.6–2',
        cnName: '伤害',
        cnValue: '0.6–2',
      },
      {
        name: 'Falloff range',
        value: '10-20 m',
        cnName: '衰减距离',
        cnValue: '10-20 m',
      },
      {
        name: 'Move. speed',
        value: '2.75 m/s',
        cnName: '移动速度',
        cnValue: '2.75 m/s',
      },
      {
        name: 'Rate of fire',
        value: '6.67 r/s',
        cnName: '射速',
        cnValue: '6.67 r/s',
      },
      {
        name: 'Ammo',
        value: '∞',
        cnName: '弹夹容量',
        cnValue: '∞',
      },
      {
        name: 'Headshot',
        value: '✓',
        cnName: '爆头',
        cnValue: '✓',
      },
    ],
  },
  {
    key: '2',
    abilityLogo:
      'http://overwatch.nos.netease.com/1/assets/images/hero/dva/ability-defense-matrix/icon-ability.png',
    abilityName: '机甲：防御矩阵',
    abilityDescription: 'D.Va可以激活正前方的目标锁定矩阵，挡住前方射来的飞射物。',
    abilityProperty: [
      {
        name: 'Max. range',
        value: '15 m',
        cnName: '最大范围',
        cnValue: '15 m',
      },
      {
        name: 'Duration',
        value: '0-2s',
        cnName: '持续时间',
        cnValue: '0-2 s',
      },
      {
        name: 'Cooldown',
        value: '1-8 s',
        cnName: '冷却时间',
        cnValue: '1-8 s',
      },
    ],
  },
  {
    key: '3',
    abilityLogo:
      'http://overwatch.nos.netease.com/1/assets/images/hero/dva/ability-boosters/icon-ability.png',
    abilityName: '机甲：推进器',
    abilityDescription:
      'D.Va的机甲可以飞向空中。当加速器启动时，D.Va可以向前飞行。她可以改变飞行方向或撞开前方的敌人。',
    abilityProperty: [
      {
        name: 'Damage',
        value: '10',
        cnName: '伤害',
        cnValue: '10',
      },
      {
        name: 'Move. speed',
        value: '12.5 m/s',
        cnName: '移动速度',
        cnValue: '12.5 m/s',
      },
      {
        name: 'Max. range',
        value: '0-25 m',
        cnName: '移动距离',
        cnValue: '0-25 m',
      },
      {
        name: 'Duration',
        value: '0-2 s',
        cnName: '持续时间',
        cnValue: '0-2 s',
      },
      {
        name: 'Cooldown',
        value: '5 s',
        cnName: '冷却时间',
        cnValue: '5 s',
      },
    ],
  },
  {
    key: '4',
    abilityLogo:
      'http://overwatch.nos.netease.com/1/assets/images/hero/dva/ability-light-gun/icon-ability.png',
    abilityName: '驾驶员：光枪',
    abilityDescription: '离开机甲时，D.Va可以用中距离全自动冲击枪继续战斗',
    abilityProperty: [],
  },
  {
    key: '5',
    abilityLogo:
      'http://overwatch.nos.netease.com/1/assets/images/hero/dva/ability-micro-missiles/icon-ability.png',
    abilityName: '微型飞弹',
    abilityDescription: 'D.Va射出一连串高爆飞弹。',
    abilityProperty: [],
  },
  {
    key: '6',
    abilityLogo:
      'http://overwatch.nos.netease.com/1/assets/images/hero/dva/ability-self-destruct/icon-ability.png',
    abilityName: '机甲：自毁',
    abilityDescription: 'D.Va可以从机甲中弹出并将反应器设定为自爆，对附近敌人造成巨大伤害。',
    abilityProperty: [],
  },
  {
    key: '7',
    abilityLogo:
      'http://overwatch.nos.netease.com/1/assets/images/hero/dva/ability-call-mech/icon-ability.png',
    abilityName: '驾驶员：呼叫机甲',
    abilityDescription: '如果D.Va的装甲战斗机甲被摧毁，她可以呼叫一台全新的机甲回到战斗。',
    abilityProperty: [],
  },
]

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
              abilities: values.abilities.map(x => {
                return {
                  ...x,
                  abilityProperty: x.abilityProperty.map(y => ({
                    cnName: y.cnName,
                    cnValue: y.cnValue,
                    name: y.name,
                    value: y.value,
                  })),
                }
              }),
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
                  <Form.Item label={fieldLabels.remark}>
                    {getFieldDecorator('remark', {
                      initialValue: current.remark || '',
                      rules: [{ required: false, message: '请输入英雄台词' }],
                    })(<Input style={{ width: '100%' }} placeholder="请输入英雄台词" />)}
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
