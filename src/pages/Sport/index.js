import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import {
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { SPORT_STATUS } from '@/constant'

import styles from './index.less'

const FormItem = Form.Item
const { Step } = Steps
const { TextArea } = Input
const { Option } = Select
const RadioGroup = Radio.Group
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      const values = {
        ...fieldsValue,
        startDate: {
          __type: 'Date',
          iso: fieldsValue.startDate.format('YYYY-MM-DD HH:mm:ss'),
        },
        endDate: {
          __type: 'Date',
          iso: fieldsValue.endDate.format('YYYY-MM-DD HH:mm:ss'),
        },
      }
      form.resetFields()
      handleAdd(values)
    })
  }
  return (
    <Modal
      destroyOnClose
      title="新建赛事"
      width={640}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事名称">
        {form.getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入赛事名称！',
              min: 1,
            },
          ],
        })(<Input placeholder="请输入赛事名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事英文名称">
        {form.getFieldDecorator('englishTitle', {
          rules: [
            {
              required: false,
              message: '请输入赛事英文名称！',
            },
          ],
        })(<Input placeholder="请输入赛事英文名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事简称">
        {form.getFieldDecorator('abbreviatedTitle', {
          rules: [
            {
              required: false,
              message: '请输入赛事简称！',
            },
          ],
        })(<Input placeholder="请输入赛事简称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事描述">
        {form.getFieldDecorator('description', {
          rules: [
            {
              required: false,
              message: '请输入赛事描述！',
            },
          ],
        })(<TextArea rows={5} placeholder="请输入赛事描述" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事LOGO">
        {form.getFieldDecorator('logo', {
          rules: [
            {
              required: false,
              message: '请输入赛事LOGO！',
            },
          ],
        })(<Input placeholder="请输入赛事LOGO" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事海报">
        {form.getFieldDecorator('pic', {
          rules: [
            {
              required: false,
              message: '请输入赛事海报！',
            },
          ],
        })(<Input placeholder="请输入赛事海报" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事开始时间">
        {form.getFieldDecorator('startDate', {
          rules: [
            {
              required: true,
              message: '请选择赛事开始时间！',
            },
          ],
        })(
          <DatePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="请输入赛事开始时间"
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事结束时间">
        {form.getFieldDecorator('endDate', {
          rules: [
            {
              required: true,
              message: '请选择赛事结束时间！',
            },
          ],
        })(
          <DatePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="请输入赛事结束时间"
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事状态">
        {form.getFieldDecorator('status', {
          initialValue: 'PENDING',
          rules: [
            {
              required: true,
              message: '请输入赛事赛事状态！',
            },
          ],
        })(
          <RadioGroup>
            {SPORT_STATUS.map(x => (
              <Radio key={x.value} value={x.value}>
                {x.text}
              </Radio>
            ))}
          </RadioGroup>
        )}
      </FormItem>
    </Modal>
  )
})

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    }

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    }
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props
    const { formVals: oldValue } = this.state
    form.validateFields((err, fieldsValue) => {
      if (err) return
      const formVals = { ...oldValue, ...fieldsValue }
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward()
          } else {
            handleUpdate(formVals)
          }
        }
      )
    })
  }

  backward = () => {
    const { currentStep } = this.state
    this.setState({
      currentStep: currentStep - 1,
    })
  }

  forward = () => {
    const { currentStep } = this.state
    this.setState({
      currentStep: currentStep + 1,
    })
  }

  renderContent = (currentStep, formVals) => {
    const { form } = this.props
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ]
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ]
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入规则名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [
            {
              required: true,
              message: '请输入至少五个字符的规则描述！',
              min: 5,
            },
          ],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ]
  }

  renderFooter = currentStep => {
    const { handleUpdateModalVisible } = this.props
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ]
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ]
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ]
  }

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props
    const { currentStep, formVals } = this.state

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置规则属性" />
          <Step title="设定调度周期" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    )
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ sport, loading }) => ({
  sport,
  loading: loading.models.sport,
}))
@Form.create()
class SportList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  }

  columns = [
    {
      title: '赛事名称',
      dataIndex: 'title',
    },
    {
      title: '赛事简称',
      dataIndex: 'abbreviatedTitle',
    },
    {
      title: '赛事英文名称',
      dataIndex: 'englishTitle',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: SPORT_STATUS[0].text,
          value: 'PENDING',
        },
        {
          text: SPORT_STATUS[1].text,
          value: 'LIVING',
        },
        {
          text: SPORT_STATUS[2].text,
          value: 'CONCLUDED',
        },
      ],
      render(val) {
        return (
          <Badge
            status={SPORT_STATUS.filter(x => x.value === val)[0].status}
            text={SPORT_STATUS.filter(x => x.value === val)[0].text}
          />
        )
      },
    },
    {
      title: '开赛时间',
      dataIndex: 'startDate',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </Fragment>
      ),
    },
  ]

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'sport/getSportsByPage',
      payload: {},
    })
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props
    const { formValues } = this.state

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj }
      newObj[key] = getValue(filtersArg[key])
      return newObj
    }, {})

    const params = {
      ...formValues,
      ...filters,
    }
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`
    }
    dispatch({
      type: 'sport/getSportsByPage',
      payload: {
        params,
        pagination: {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
        },
      },
    })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props
    form.resetFields()
    this.setState({
      formValues: {},
    })
    dispatch({
      type: 'sport/getSportsByPage',
      payload: {},
    })
  }

  toggleForm = () => {
    const { expandForm } = this.state
    this.setState({
      expandForm: !expandForm,
    })
  }

  handleMenuClick = e => {
    const { dispatch } = this.props
    const { selectedRows } = this.state

    if (!selectedRows) return
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'sport/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            })
          },
        })
        break
      default:
        break
    }
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    })
  }

  handleSearch = e => {
    e.preventDefault()

    const { dispatch, form } = this.props

    form.validateFields((err, fieldsValue) => {
      if (err) return

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      }

      this.setState({
        formValues: values,
      })

      dispatch({
        type: 'sport/fetch',
        payload: values,
      })
    })
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    })
  }

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    })
  }

  handleAdd = fields => {
    const { dispatch } = this.props

    dispatch({
      type: 'sport/putSports',
      payload: fields,
    })

    message.success('添加成功')
    this.handleModalVisible()
  }

  handleUpdate = fields => {
    const { dispatch } = this.props
    dispatch({
      type: 'sport/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    })

    message.success('配置成功')
    this.handleUpdateModalVisible()
  }

  render() {
    const {
      sport: { data },
      loading,
    } = this.props

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    )

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    }
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    }
    return (
      <PageHeaderWrapper title="赛事列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    )
  }
}

export default SportList
