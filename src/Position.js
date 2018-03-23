// @flow
import React, { PureComponent } from 'react';
import ReactTable from 'react-table';
import marchSorter from 'match-sorter';
import classnames from 'classnames';
import styles from './style.pcss';
import TextArea from './TextArea';
import TextInput from './TextInput';
import { userUpdate } from './serviceUtils';

export default class Position extends PureComponent {
  constructor(props){
    super(props)
    this.state = props.attributes.reduce((finalResult, val)=>{
      if (!finalResult[val]) finalResult[val] = false;
      return finalResult;
    }, props.initialAttributes);
  }
  toggleAttr = (attr)=>{
    this.setState({
      [attr]: !this.state[attr],
    })
  }
  handleChange = (name, player, value)=>{
    return userUpdate(player.playerid, { [name]: value }).then(()=>{
      this.props.reset();
    });
  }
  render() {
    const columnNames = Object.keys(this.state).reduce((finalResult, key)=>{
      if (this.state[key]) finalResult.push(key);
      return finalResult;
    }, [])
    const columns = columnNames.map((name) => ({
      Header: name,
      accessor: name,
      width: 60,
      ...(name === 'name' ? {
        filterable: true,
        filterMethod: (filter, rows) => marchSorter(rows, filter.value, { keys: ['name'] }),
        filterAll: true,
        width: 200
      } : {}),
      ...(name === 'notes' || name === 'injuries' || name === 'prospect' ? {
        Cell: row => {
          return (
            <TextArea rows={5} defaultValue={row.value || ""} onChange={this.handleChange.bind(this, name, row.original)} />
          )
        },
        width: 300,
      } : {}),
      ...(name === 'tier' || name === 'drafted' ? {
        Cell: row => {
          return (
            <TextInput defaultValue={row.value || ""} onChange={this.handleChange.bind(this, name, row.original)} />
          )
        },
        width: 50,
      } : {}),
    }));
    return (<div>
      {
        this.props.attributes.map(attr => <span key={attr} className={classnames(styles.selectProps, {
          [styles.active]: this.state[attr],
        })} onClick={this.toggleAttr.bind(this, attr)}>{attr}</span>)
      }
      <ReactTable
      defaultSorted={[
        { id: "value", desc: true },
      ]}
      data={this.props.data}
      columns={columns}
      defaultPageSize={100}
      SubComponent={(row)=>{
        return <div>{row.viewIndex + 1}</div>
      }}
    />
    </div>);
  }
}
