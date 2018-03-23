// @flow
import React, { PureComponent } from 'react';
import ReactTable from 'react-table';
import marchSorter from 'match-sorter';
import classnames from 'classnames';
import styles from './style.pcss';
import TextArea from '../TextArea';
import { userUpdate } from '../serviceUtils';

const attributes = [
  'name',
  'position',
  'value',
  'zscore',
  'team',
  'g',
  'gs',
  'ip',
  'era',
  'whip',
  'so',
  'sv',
  'w',
  'adp',
  'playerid',
  'notes',
];

const state = attributes.reduce((finalResult, val)=>{
  if (!finalResult[val]) finalResult[val] = false;
  return finalResult;
}, {
  'name': true,
  'position': true,
  'value': true,
  'zscore': true,
  'team': true,
  'g': true,
  'gs': true,
  'ip': true,
  'era': true,
  'whip': true,
  'so': true,
  'sv': true,
  'w': true,
  'adp': true,
  'playerid': true,
  notes: true,
})
export default class Position extends PureComponent {
  state = state
  toggleAttr = (attr)=>{
    this.setState({
      [attr]: !this.state[attr],
    })
  }
  handleNotesChange = (player, notes)=>{
    console.log('notes', notes);
    return userUpdate(player.playerid, { notes }).then(()=>{
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
      ...(name === 'name' ? {
        filterable: true,
        filterMethod: (filter, rows) => marchSorter(rows, filter.value, { keys: ['name'] }),
        filterAll: true,
      } : {}),
      ...(name === 'notes' ? {
        Cell: row => {
          return (
            <TextArea rows={5} defaultValue={row.value || ""} onChange={this.handleNotesChange.bind(this, row.original)} />
          )
        },
        width: 300,
      } : {

      })
    }));
    return (<div>
      {
        attributes.map(attr => <span key={attr} className={classnames(styles.selectProps, {
          [styles.active]: this.state[attr],
        })} onClick={this.toggleAttr.bind(this, attr)}>{attr}</span>)
      }
      <ReactTable
      defaultSorted={[
        { id: "zscore", desc: true },
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
