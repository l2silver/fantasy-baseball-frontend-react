// @flow
import React, { PureComponent } from 'react';
import ReactTable from 'react-table';
import marchSorter from 'match-sorter';
import classnames from 'classnames';
import styles from './style.pcss';
import TextArea from './TextArea';
import { userUpdate } from './serviceUtils';

const attributes = [
  'name',
  'position',
  'value',
  'zscore',
  'team',
  'g',
  'pa',
  'ab',
  'h',
  '2b',
  '3b',
  'hr',
  'r',
  'rbi',
  'bb',
  'so',
  'hbp',
  'nsb',
  'sb',
  'cs',
  'avg',
  'obp',
  'slg',
  'ops',
  'woba',
  'fld',
  'bsr',
  'war',
  'adp',
  'playerid',
  'notes',
];

const state = attributes.reduce((finalResult, val)=>{
  if (!finalResult[val]) finalResult[val] = false;
  return finalResult;
}, {
  name: true,
  value: true,
  position: true,
  zscore: true,
  team: true,
  g: true,
  hr: true,
  r: true,
  rbi: true,
  nsb: true,
  obp: true,
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
