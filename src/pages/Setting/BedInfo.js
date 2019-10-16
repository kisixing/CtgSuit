import React from "react";
import { Table, Input, InputNumber, Popconfirm, Form, Button, Select } from 'antd';
import { connect } from "dva";
import { mapStatusToText } from '@/constant'
import request from "@lianmed/request";
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return (
        <Select>
          {
            Object.entries(mapStatusToText).map(_ => {
              return (
                <Select.Option value={_[0]} key={_[0]}>
                  {_[1]}
                </Select.Option >
              )
            })
          }
        </Select>
      )
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      ...[
        {
          title: '编号',
          dataIndex: 'bedno',
          key: 'bedno',

        },
        {
          title: '名称',
          dataIndex: 'bedname',
          key: 'bedname',
        },
        {
          title: '设备编号',
          dataIndex: 'deviceno',
          key: 'deviceno',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => {
            let status = '其它';
            if (text === '0') {
              status = '离线'
            } else if (text === '1') {
              status = '在线'
            } else if (text === '2') {
              status = '工作中'
            }
            return status;
          },
        },
        {
          title: '设备类型',
          dataIndex: 'type',
          key: 'type',
          align: 'center',
        },
      ].map(_ => ({ ..._, editable: true, align: 'center' })),
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <Button
                    size="small"
                    type="link"
                    onClick={() => this.save(form, record.id)}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </Button>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
                <Button size="small" type="link">取消</Button>
              </Popconfirm>
            </span>
          ) : (
              <Button size="small" type="link" disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
                编辑
            </Button>
            );
        },
      },
    ];
  }

  isEditing = record => {
    const status = record.id === this.state.editingKey;
    return status
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'setting/fetchBed',
    });
  }
  save(form, id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.props.data];
      const index = newData.findIndex(item => id === item.id);
      if (index > -1) {

        request.put('/bedinfos', {
          data: {
            ...newData[index],
            ...row,
          }
        }).then(data => {
          this.props.dispatch({
            type: 'setting/fetchBed',
          });
          this.setState({ editingKey: '' });

        })

      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(id) {
    console.log('edit', id)
    this.setState({ editingKey: id });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'status' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          size="small"
          components={components}
          bordered
          dataSource={this.props.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default connect(({ loading, setting }) => ({
  data: setting.bedinfo,
  loading: loading,
}))(EditableFormTable);