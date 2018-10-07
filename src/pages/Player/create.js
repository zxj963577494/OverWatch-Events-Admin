import React, { PureComponent } from 'react'
import { Card, Button, Form, Icon, Col, Row, DatePicker, Input, Select, Popover, Radio } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import FooterToolbar from '@/components/FooterToolbar'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SocailTableForm from '@/pages/Player/SocailTableForm'

import styles from './index.less'

import globalCountries from '@/utils/countryMap'
import { PLAYER_ROLE } from '@/constant'

const { Option } = Select
const RadioGroup = Radio.Group

const fieldLabels = {
  name: '账号',
  birth: '生日',
  role: '位置',
  status: '状态',
  familyName: '姓氏',
  givenName: '名字',
  nationality: '国籍',
  homeLocation: '籍贯',
  headshot: '头像',
  pic: '照片',
  heros: '擅长英雄',
}

const tableData = []

@connect(({ hero, loading }) => ({
  hero,
  submitting: loading.effects['player/submit'],
}))
@Form.create()
class PlayerCreate extends PureComponent {
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
        const payload = values.birth
          ? {
              ...values,
              birth: {
                __type: 'Date',
                iso: values.birth.format('YYYY-MM-DD HH:mm:ss'),
              },
            }
          : { ...values }
        dispatch({
          type: 'player/submit',
          payload,
          callback: () => {
            dispatch(routerRedux.push('/player/list'))
          },
        })
      }
    })
  }

  render() {
    const {
      hero: {
        data: { list },
      },
      form: { getFieldDecorator },
      submitting,
    } = this.props
    const { width } = this.state

    return (
      <PageHeaderWrapper
        title="新建选手"
        content="新建选手。"
        wrapperClassName={styles.PlayerCreate}
      >
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.name}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入选手账号' }],
                  })(<Input placeholder="请输入选手账号" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24} />
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24} />
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.familyName}>
                  {getFieldDecorator('familyName', {
                    rules: [{ required: false, message: '请输入选手姓氏' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入选手姓氏" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.givenName}>
                  {getFieldDecorator('givenName', {
                    rules: [{ required: false, message: '请输入选手名字' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入选手名字" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.birth}>
                  {getFieldDecorator('birth', {
                    rules: [{ required: false, message: '请选择选手生日' }],
                  })(<DatePicker style={{ width: '100%' }} placeholder="请选择选手生日" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.headshot}>
                  {getFieldDecorator('headshot', {
                    rules: [{ required: false, message: '请输入选手头像' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入选手头像" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.pic}>
                  {getFieldDecorator('pic', {
                    rules: [{ required: false, message: '请输入选手照片' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入选手照片" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.nationality}>
                  {getFieldDecorator('nationality', {
                    initialValue: 'UK',
                    rules: [{ required: false, message: '请选择选手国籍' }],
                  })(
                    <Select
                      allowClear
                      showSearch
                      placeholder="请选择选手国籍"
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
                    rules: [{ required: false, message: '请输入选手籍贯' }],
                  })(<Input style={{ width: '100%' }} placeholder="请输入选手籍贯" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="扩展信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.status}>
                  {getFieldDecorator('status', {
                    initialValue: 'active',
                    rules: [{ required: true, message: '请选择选手状态！' }],
                  })(
                    <RadioGroup>
                      <Radio key={1} value="active">
                        现役
                      </Radio>
                      <Radio key={2} value="retired">
                        退役
                      </Radio>
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.role}>
                  {getFieldDecorator('role', {
                    initialValue: 'flex',
                    rules: [{ required: true, message: '请选择选手位置' }],
                  })(
                    <RadioGroup>
                      {PLAYER_ROLE.map(x => (
                        <Radio key={x.value} value={x.value}>
                          {x.text}
                        </Radio>
                      ))}
                    </RadioGroup>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.heros}>
                  {getFieldDecorator('heros', {
                    initialValue: [],
                    rules: [{ required: false, message: '请选择擅长英雄' }],
                  })(
                    <Select
                      allowClear
                      showSearch
                      mode="multiple"
                      placeholder="请选择擅长英雄"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {list.map(x => (
                        <Option key={x.key} value={x.objectId}>
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
            initialValue: tableData,
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

export default PlayerCreate
