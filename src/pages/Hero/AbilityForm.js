import React, { PureComponent, Fragment } from 'react'
import { Button, Input, message, List, Form, Card, Avatar, Modal } from 'antd'
import isEqual from 'lodash/isEqual'
import Result from '@/components/Result'
import TableForm from './TableForm'
import styles from './style.less'

const FormItem = Form.Item

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
      done: false,
      abilityCurrent: {
        abilityTitle: '',
        abilityLogo: '',
        abilityVideoUrl: '',
        abilityDescription: '',
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
    const newData = data.filter(x => x.abilityTitle !== item.abilityTitle)
    this.setState({
      data: newData,
    })
    onChange(newData)
  }

  handleAbilitySubmit = e => {
    e.preventDefault()
    this.setState({
      loading: true,
    })
    const { form } = this.props
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return message.error('请填写正确信息。')
      }
      const { data } = this.state
      const newData = data.map(item => ({ ...item }))
      newData.unshift({
        abilityTitle: fieldsValue.abilityTitle,
        abilityLogo: fieldsValue.abilityLogo,
        abilityVideoUrl: fieldsValue.abilityVideoUrl,
        abilityDescription: fieldsValue.abilityDescription,
        abilityProperty: fieldsValue.abilityProperty,
      })
      const { onChange } = this.props
      onChange(newData)
      this.setState({
        done: true,
        loading: false,
      })
    })
  }

  handleAbilityDone = () => {
    this.setState({
      done: false,
      abilityVisible: false,
    })
  }

  handleAbilityCancel = () => {
    this.setState({
      abilityVisible: false,
    })
  }

  render() {
    const { loading, data, abilityVisible, done } = this.state

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

    const modalFooter = done
      ? { footer: null, onCancel: this.handleAbilityDone }
      : { okText: '保存', onOk: this.handleAbilitySubmit, onCancel: this.handleAbilityCancel }

    const getAbilityModalContent = () => {
      const {
        form: { getFieldDecorator },
      } = this.props
      const { abilityCurrent } = this.state
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            actions={
              <Button type="primary" onClick={this.handleAbilityDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        )
      }
      return (
        <Form className={styles.modal} onSubmit={this.handleAbilitySubmit}>
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
              })(<Input placeholder="技能描述" />)}
            </FormItem>
          </Card>
          <Card title="扩展信息" bordered={false}>
            {getFieldDecorator('abilityProperty', {
              initialValue: abilityCurrent.abilityProperty,
            })(<TableForm />)}
          </Card>
        </Form>
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
                title={<a href={item.href}>{item.abilityName}</a>}
                description={item.abilityDescription}
              />
              <ListContent data={item} />
            </List.Item>
          )}
        />
        <Modal
          title={done ? null : `技能添加`}
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
