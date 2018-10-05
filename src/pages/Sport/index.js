import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Card, Form, Input, Button, DatePicker, Modal, message, Badge, Divider, Radio } from 'antd'
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
  const {
    modalVisible,
    form,
    handleAdd,
    handleEdit,
    handleModalVisible,
    title,
    model,
    isAdd,
  } = props
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
      if (isAdd) {
        handleAdd(values)
      } else {
        const id = model.objectId
        handleEdit({id, ...values})
      }
    })
  }
  const cancelHandle = () => {
    form.resetFields()
    handleModalVisible()
  }
  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title={title}
      width={640}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="赛事名称">
        {form.getFieldDecorator('title', {
          initialValue: model.title,
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
          initialValue: model.englishTitle,
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
          initialValue: model.abbreviatedTitle,
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
          initialValue: model.description,
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
          initialValue: model.logo,
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
          initialValue: model.pic,
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
          initialValue: moment(model.startDate),
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
          initialValue: moment(model.endDate),
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
          initialValue: model.status || 'PENDING',
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
    model: {
      title: '',
    },
    isAdd: true,
  }

  columns = [
    {
      title: '赛事名称',
      dataIndex: 'title',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditClick(record)}>{text}</a>
        </Fragment>
      ),
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
          <a onClick={() => this.handleEditClick(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleRemove(record)}>移除</a>
          <Divider type="vertical" />
          <a href="">新建赛程</a>
        </Fragment>
      ),
    },
  ]

  pagination = {}

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

  handleAddClick = () => {
    this.setState({
      isAdd: true,
      model: {},
    })
    this.handleModalVisible(true)
  }

  handleEditClick = record => {
    this.setState({
      isAdd: false,
      model: record,
    })
    this.handleModalVisible(true)
  }

  handleAdd = fields => {
    const { dispatch } = this.props

    dispatch({
      type: 'sport/submit',
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

  handleEdit = fields => {
    const { dispatch } = this.props

    dispatch({
      type: 'sport/submit',
      payload: fields,
      callback: () => {
        dispatch({
          type: 'sport/fetch',
          payload: { pagination: this.pagination },
        })
      },
    })
    message.success('编辑成功')
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

    const { selectedRows, modalVisible, isAdd, model } = this.state

    const parentMethods = {
      isAdd,
      model,
      title: `${isAdd ? '新增' : '编辑'}赛事`,
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
    }

    return (
      <PageHeaderWrapper title="赛事列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAddClick}>
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
