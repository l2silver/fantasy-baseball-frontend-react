// @flow
import React, { PureComponent } from 'react';
import ReactTable from 'react-table';

export default class Position extends PureComponent {
  render() {
    const attributes = [
      'name',
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
    ];
    // Create some column definitions
    const columns = attributes.map((name) => ({
      header: name,
      accessor: name,
    }));
    
    return (<ReactTable
      data={this.props.data}
      columns={columns}
      defaultPageSize={100}
    />);
  }
}
