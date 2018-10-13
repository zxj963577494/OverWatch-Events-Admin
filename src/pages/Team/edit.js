import React, { PureComponent } from 'react'
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Popover,
  Radio,
  message,
} from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import FooterToolbar from '@/components/FooterToolbar'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SocailTableForm from '@/pages/Player/SocailTableForm'

import styles from './index.less'

import globalCountries from '@/utils/countryMap'
import { SPORT_RANK, TEAM_STATUS } from '@/constant'

const { Option } = Select
const { TextArea } = Input
const RadioGroup = Radio.Group

const fieldLabels = {
  name: '队名',
  abbreviatedName: '缩写',
  primaryColor: '主色调',
  secondaryColor: '次色调',
  addressCountry: '国家',
  homeLocation: '地区',
  description: '描述',
  createdTime: '创立时间',
  status: '状态',
  manager: '经理',
  coaches: '教练',
  rank: '级别',
  logo: 'LOGO',
  pic: '图片',
  players: '成员',
}

@connect(({ loading, player, team }) => ({
  player,
  team,
  submitting: loading.effects['team/edit'],
}))
@Form.create()
class TeamEdit extends PureComponent {
  state = {
    width: '100%',
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    if (!match.params.id) {
      message.error('缺少参数：id')
      setTimeout(() => {
        dispatch(routerRedux.push('/team/list'))
      }, 1500)
    }
    dispatch({
      type: 'player/fetchAll',
    })
    dispatch({
      type: 'team/fetchById',
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
      team: {
        data: { current },
      },
    } = this.props
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { id } = current
        dispatch({
          type: 'team/edit',
          payload: {
            id,
            params: {
              ...values,
              accounts: values.accounts.map(x => ({
                account: x.account,
                url: x.url,
              })),
              createdTime: moment(values.createdTime).format('YYYY-MM-DD'),
            },
          },
          callback: () => {
            dispatch(routerRedux.push('/team/list'))
          },
        })
      }
    })
  }

  render() {
    const {
      player: {
        data: { list },
      },
      team: {
        data: { current },
      },
      form: { getFieldDecorator },
      submitting,
    } = this.props
    const { width } = this.state

    return (
      <PageHeaderWrapper title="编辑队伍" content="编辑队伍。" wrapperClassName={styles.TeamEdit}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  {getFieldDecorator('name', {
                    initialValue: current.name || '',
                    rules: [{ required: true, message: '请输入队伍名称' }],
                  })(<Input placeholder="请输入队伍名称" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.abbreviatedName}>
                  {getFieldDecorator('abbreviatedName', {
                    initialValue: current.abbreviatedName || '',
                    rules: [{ required: true, message: '请输入队名缩写' }],
                  })(<Input placeholder="请输入队名缩写" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.createdTime}>
                  {getFieldDecorator('createdTime', {
                    initialValue: current.createdTime ? moment(current.createdTime) : null,
                    rules: [{ required: false, message: '请选择队伍创立时间' }],
                  })(<DatePicker style={{ width: '100%' }} placeholder="请选择队伍创立时间" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.status}>
                  {getFieldDecorator('status', {
                    initialValue: current.status || 'active',
                    rules: [{ required: true, message: '请选择队伍状态！' }],
                  })(
                    <RadioGroup>
                      {TEAM_STATUS.map(x => (
                        <Radio key={x.value} value={x.value}>
                          {x.text}
                        </Radio>
                      ))}
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.rank}>
                  {getFieldDecorator('rank', {
                    initialValue: current.rank || 'owl',
                    rules: [{ required: true, message: '请选择参赛级别' }],
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择参赛级别"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {SPORT_RANK.map(x => (
                        <Option key={x.value} value={x.value}>
                          {x.text}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24} />
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.logo}>
                  {getFieldDecorator('logo', {
                    initialValue: current.logo || '',
                    rules: [{ required: false, message: '请输入队伍LOGO' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入队伍LOGO" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.pic}>
                  {getFieldDecorator('pic', {
                    initialValue: current.pic || '',
                    rules: [{ required: false, message: '请输入队伍照片' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入队伍照片" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.addressCountry}>
                  {getFieldDecorator('addressCountry', {
                    initialValue: current.addressCountry || 'UK',
                    rules: [{ required: false, message: '请选择队伍国家' }],
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择队伍国家"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {globalCountries.map(x => (
                        <Option key={x.code} value={x.code}>
                          {x.cn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.homeLocation}>
                  {getFieldDecorator('homeLocation', {
                    initialValue: current.homeLocation || '',
                    rules: [{ required: false, message: '请输入队伍地区' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入队伍地区" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.description}>
                  {getFieldDecorator('description', {
                    initialValue: current.description || '',
                    rules: [{ required: false, message: '请输入队伍描述' }],
                  })(<TextArea rows={4} style={{ width: '100%' }} placeholder="请输入队伍描述" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="扩展信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.manager}>
                  {getFieldDecorator('manager', {
                    initialValue: current.manager || '',
                    rules: [{ required: false, message: '请输入队伍经理' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入队伍经理" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.coaches}>
                  {getFieldDecorator('coaches', {
                    initialValue: current.coaches || '',
                    rules: [{ required: false, message: '请输入队伍教练' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入队伍教练" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.players}>
                  {getFieldDecorator('players', {
                    initialValue: current.players || [],
                    rules: [{ required: false, message: '请选择队伍成员' }],
                  })(
                    <Select
                      allowClear
                      showSearch
                      mode="multiple"
                      placeholder="请选择队伍成员"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {list.map(x => (
                        <Option key={x.key} value={x.id}>
                          {x.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="社交账号" bordered={false}>
          {getFieldDecorator('accounts', {
            initialValue: current.accounts || [],
          })(<SocailTableForm />)}
        </Card>
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

export default TeamEdit
