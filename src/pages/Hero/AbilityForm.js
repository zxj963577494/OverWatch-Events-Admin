import React, { PureComponent, Fragment } from 'react'
import { Button, Input, message, List, Form, Card, Avatar, Modal, Select } from 'antd'
import nanoid from 'nanoid'
import isEqual from 'lodash/isEqual'
import TableForm from './TableForm'
import styles from './style.less'

const FormItem = Form.Item
const { TextArea } = Input

@Form.create()
class AbilityForm extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
      abilityVisible: false,
      abilityCurrent: {
        abilityTitle: '',
        abilityLogo: '',
        abilityVideoUrl: '',
        abilityDescription: '',
        abilityRemark: '',
        abilityTags: [],
        abilityProperty: [],
      },
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    }
  }

  showAbilityModal = () => {
    this.setState({
      abilityVisible: true,
    })
  }

  showAbilityEditModal = item => {
    this.setState({
      abilityVisible: true,
      abilityCurrent: item,
    })
  }

  handleAbilityRemove = item => {
    const { data } = this.state
    const { onChange } = this.props
    const newData = data.filter(x => x.key !== item.key)
    this.setState({
      data: newData,
    })
    onChange(newData)
  }

  handleAbilitySubmit = e => {
    e.preventDefault()
    this.setState({
      loading: true,
      abilityVisible: false,
    })
    const { form } = this.props
    const { abilityCurrent } = this.state
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error('请填写正确信息。')
        return
      }
      const { data } = this.state
      if (abilityCurrent.key) {
        data.forEach(x => {
          if (x.key === abilityCurrent.key) {
            /* eslint-disable */
            x.abilityTitle = fieldsValue.abilityTitle
            x.abilityLogo = fieldsValue.abilityLogo
            x.abilityVideoUrl = fieldsValue.abilityVideoUrl
            x.abilityDescription = fieldsValue.abilityDescription
            x.abilityRemark = fieldsValue.abilityRemark
            x.abilityTags = fieldsValue.abilityTags
            x.abilityProperty = fieldsValue.abilityProperty
          }
        })
      } else {
        data.unshift({
          key: nanoid(8),
          abilityTitle: fieldsValue.abilityTitle,
          abilityLogo: fieldsValue.abilityLogo,
          abilityVideoUrl: fieldsValue.abilityVideoUrl,
          abilityDescription: fieldsValue.abilityDescription,
          abilityRemark: fieldsValue.abilityRemark,
          abilityTags: fieldsValue.abilityTags,
          abilityProperty: fieldsValue.abilityProperty,
        })
      }
      const newData = data.map(item => ({ ...item }))
      const { onChange } = this.props
      onChange(newData)
      this.setState({
        loading: false,
      })
    })
  }

  handleAbilityCancel = () => {
    this.setState({
      abilityVisible: false,
    })
  }

  render() {
    const { loading, data, abilityVisible } = this.state

    const ListContent = ({ data: { abilityProperty } }) => (
      <div className={styles.listContent}>
        {abilityProperty.slice(0, 7).map(x => (
          <div key={x.name} className={styles.listContentItem}>
            <span>{x.cnName}</span>
            <p>{x.cnValue}</p>
          </div>
        ))}
      </div>
    )

    const modalFooter = {
      okText: '保存',
      onOk: this.handleAbilitySubmit,
      onCancel: this.handleAbilityCancel,
    }

    const getAbilityModalContent = () => {
      const {
        form: { getFieldDecorator },
      } = this.props
      const { abilityCurrent } = this.state
      return (
        <div className={styles.modal} style={{ height: 500, overflowY: 'auto' }}>
          <Form onSubmit={this.handleAbilitySubmit}>
            <Card title="基本信息" bordered={false}>
              <FormItem label="技能名称" {...this.formLayout}>
                {getFieldDecorator('abilityTitle', {
                  rules: [{ required: true, message: '请输入技能名称' }],
                  initialValue: abilityCurrent.abilityTitle,
                })(<Input placeholder="请输入技能名称" />)}
              </FormItem>
              <FormItem label="LOGO" {...this.formLayout}>
                {getFieldDecorator('abilityLogo', {
                  rules: [{ required: true, message: '请输入LOGO' }],
                  initialValue: abilityCurrent.abilityLogo,
                })(<Input placeholder="请输入LOGO" />)}
              </FormItem>
              <FormItem label="视频地址" {...this.formLayout}>
                {getFieldDecorator('abilityVideoUrl', {
                  initialValue: abilityCurrent.abilityVideoUrl,
                })(<Input placeholder="请输入视频地址" />)}
              </FormItem>
              <FormItem label="技能描述" {...this.formLayout}>
                {getFieldDecorator('abilityDescription', {
                  initialValue: abilityCurrent.abilityDescription,
                })(<TextArea rows={3} placeholder="技能描述" />)}
              </FormItem>
              <FormItem label="技能点评" {...this.formLayout}>
                {getFieldDecorator('abilityRemark', {
                  initialValue: abilityCurrent.abilityRemark,
                })(<TextArea rows={3} placeholder="技能点评" />)}
              </FormItem>
              <FormItem label="自定义标签" {...this.formLayout}>
                {getFieldDecorator('abilityTags', {
                  initialValue: abilityCurrent.abilityTags,
                })(<Select mode="tags" placeholder="请输入自定义标签" style={{ width: '100%' }} />)}
              </FormItem>
            </Card>
            <Card title="扩展信息" bordered={false}>
              {getFieldDecorator('abilityProperty', {
                initialValue: abilityCurrent.abilityProperty,
              })(<TableForm />)}
            </Card>
          </Form>
        </div>
      )
    }

    return (
      <Fragment>
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={this.showAbilityModal}
        >
          添加
        </Button>
        <List
          size="large"
          rowKey="id"
          loading={loading}
          dataSource={data}
          pagination={false}
          renderItem={item => (
            <List.Item
              actions={[
                <a
                  onClick={e => {
                    e.preventDefault()
                    this.showAbilityEditModal(item)
                  }}
                >
                  编辑
                </a>,
                <a
                  onClick={e => {
                    e.preventDefault()
                    this.handleAbilityRemove(item)
                  }}
                >
                  移除
                </a>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.abilityLogo} shape="square" size="large" />}
                title={<a href={item.href}>{item.abilityTitle}</a>}
                description={item.abilityDescription}
              />
              <ListContent data={item} />
            </List.Item>
          )}
        />
        <Modal
          title="技能添加"
          className={styles.standardListForm}
          width={720}
          destroyOnClose
          visible={abilityVisible}
          {...modalFooter}
        >
          {getAbilityModalContent()}
        </Modal>
      </Fragment>
    )
  }
}

export default AbilityForm
