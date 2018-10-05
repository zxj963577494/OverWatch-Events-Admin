import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Radio,
} from 'antd'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { SPORT_STATUS } from '@/constant'

import styles from './index.less'

const FormItem = Form.Item
const { TextArea } = Input
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
      maskClosable={false}
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

/* eslint react/no-multi-comp:0 */
@connect(({ sport, loading }) => ({
  sport,
  loading: loading.models.sport,
}))
@Form.create()
class SportList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  }

  pagination = {}

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
          <a onClick={() => this.handleRemove(record)}>移除</a>
          <Divider type="vertical" />
          <a href="">新建赛程</a>
        </Fragment>
      ),
    },
  ]

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'sport/fetch',
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
    this.pagination = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    }
    dispatch({
      type: 'sport/fetch',
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
      type: 'sport/fetch',
      payload: {},
    })
  }

  toggleForm = () => {
    const { expandForm } = this.state
    this.setState({
      expandForm: !expandForm,
    })
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    })
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    })
  }

  handleAdd = fields => {
    const { dispatch } = this.props

    dispatch({
      type: 'sport/create',
      payload: fields,
      callback: () => {
        dispatch({
          type: 'sport/fetch',
          payload: {},
        })
      },
    })
    message.success('添加成功')
    this.handleModalVisible()
  }

  handleRemove = record => {
    const { dispatch } = this.props
    dispatch({
      type: 'sport/remove',
      payload: {
        objectId: record.objectId,
      },
      callback: () => {
        dispatch({
          type: 'sport/fetch',
          payload: { pagination: this.pagination },
        })
      },
    })
    message.success('移除成功')
  }

  render() {
    const {
      sport: { data },
      loading,
    } = this.props

    const { selectedRows, modalVisible } = this.state

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    }

    return (
      <PageHeaderWrapper title="赛事列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建赛事
              </Button>
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
      </PageHeaderWrapper>
    )
  }
}

export default SportList
