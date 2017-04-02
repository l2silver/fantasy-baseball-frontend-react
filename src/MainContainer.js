// @flow
import React, { PureComponent } from 'react';
import zscore from 'zscore';
import 'react-table/react-table.css';
import { connect } from 'react-redux';

import { get, getUrl } from './serviceUtils';

import Position from './Position';

class MainContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      position: 'c',
      allData: {},
    };
  }
  state: {
    allData: Object;
    data: Object;
    position: string;
  };
  componentWillMount() {
    const numbers = {
      c: 20, 
      '1b': 25,
      '2b': 25,
      'ss': 25,
      '3b': 25,
      'rf': 30,
      'cf': 30,
      'lf': 35,
      'of': 95,
    };
    const attributes = ['nsb', 'rbi', 'r', 'hr', 'obp'];
    const getNSB = player => ({ ...player, nsb: (player.sb - player.cs) });
    const getzscoreAtIndex = (zscores, index) => attributes.reduce((finalResult, stat) => {
      return finalResult + zscores[stat][index];
    }, 0);
    get(getUrl('users')).then((allData) => {
      const data = Object.keys(numbers).reduce((finalResult, key) => {
        const players = allData[key].slice(0, numbers[key]);
        finalResult[key] = players.map(getNSB);
        return finalResult;
      }, {});
      const zData = Object.keys(data).reduce((finalResult, key) => {
        const zscores = attributes.reduce((finalFinalResult, stat) => {
          finalFinalResult[stat] = zscore(data[key].map(stats => stats[stat]));
          return finalFinalResult;
        }, {});
        const totalZscores = zscores.hr.map((value, index) => getzscoreAtIndex(zscores, index));
        finalResult[key] = totalZscores;
        return finalResult;
      }, {});
      const dataWithZScore = Object.keys(data).reduce((finalResult, position) => {
        const positionData = data[position];
        const zDataPosition = zData[position];
        const players = positionData.map((player, index) => ({ ...player, zscore: zDataPosition[index] }));
        finalResult[position] = players;
        return finalResult;
      }, {});
      this.setState({
        allData,
        data: dataWithZScore,
        zData,
      });
    });
  }
  render() {
    const attributes = [
      'name',
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
    const tables = ['c', '1b', '2b', 'ss', '3b', 'rf', 'cf', 'lf', 'of'];
    return (<Container>
      <ul className="nav nav-tabs">
        {
          tables.map(name => <li role="presentation">
            <a href="#" onClick={ this.changePosition.bind(this, name) }>{name}</a>
          </li>
          )
        }
      </ul>
      <Position data={this.state.data[this.state.position]} />
    </Container>);
  }
  changePosition = (position) => {
    this.setState({
      position,
    });
  }
}

const mapStateToProps = createStructuredSelector({
});

function mapDispatchToProps(dispatch) {
  return {
    
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
