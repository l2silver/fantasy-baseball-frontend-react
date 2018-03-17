// @flow
import React, { PureComponent } from 'react';
import zscore from 'zscore';
import 'react-table/react-table.css';
import { get, getUrl } from './serviceUtils';

import Position from './Position';
import PitcherPosition from './PitcherPosition';

const positions = ['c', '1b', '2b', 'ss', '3b', 'rf', 'cf', 'lf']
const pitcherPositions = ['p', 'rp'];
const allPitcherPositions = pitcherPositions.concat(['allPitchers'])
const pitcherPositionsObj = allPitcherPositions.reduce((finalResult, p)=>{
  finalResult[p] = true
  return finalResult;
},{})
const tables = positions.concat(allPitcherPositions).concat(['all']);
class MainContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      players: {
        data: {}
      },
      position: 'cf',
      pitchers: {
        data: {}
      },
    };
  }
  state: {
    allData: Object;
    data: Object;
    position: string;
  };
  componentWillMount() {
    const playerNumbers = {
      c: 20, 
      '1b': 25,
      '2b': 25,
      'ss': 25,
      '3b': 25,
      'rf': 30,
      'cf': 30,
      'lf': 35,
      // 'of': 95,
    };
    const playersValued = {

    }

    const pitchersValued = {
      
    }
    const totalAvailable = 215;
    const totalMoney = 150 * 14; // 2100
    const totalPlayers = 11 * 14; // 154
    const attributes = ['nsb', 'rbi', 'r', 'hr', 'obp'];
    const pitcherAttributes = ['era', 'whip', 'so', 'sv', 'w'];
    const pitcherNumbers = {
      p: 125,
      rp: 90,
    }

    const getRP = (player)=>({
      ...player, rp: player.gs < 7 || player.gp > 40,
    });

    const getNSB = player => ({ ...player, nsb: (player.sb - player.cs) });
    const getPosition = (position, player) => ({ ...player, position });
    const getzscoreAtIndex = (zscores, index, attrs = attributes) => attrs.reduce((finalResult, stat) => {
      if (stat === 'sv') {
        // console.log('sv', zscores[stat][index]);
      }
      if (stat === 'era' || stat === 'whip') {
        return finalResult - zscores[stat][index];
      }
      return finalResult + zscores[stat][index];
    }, 10);
    const getProperPlayers = (allData, key, numbers) => {
      return allData[key].slice(0, numbers[key]);
    };
    get(getUrl('users')).then((allData) => {
      const data = Object.keys(playerNumbers).reduce((finalResult, key) => {
        const players = getProperPlayers(allData, key, playerNumbers);
        finalResult[key] = players.map(getNSB).map(getPosition.bind(null, key));
        return finalResult;
      }, {});
      const pitcherData = Object.keys(pitcherNumbers).reduce((finalResult, key) => {
        const players = getProperPlayers(allData, key, pitcherNumbers);
        finalResult[key] = players.map(getRP).map(getPosition.bind(null, key));
        return finalResult;
      }, {});

      const pitcherZData = Object.keys(pitcherData).reduce((finalResult, key) => {
        const zscores = pitcherAttributes.reduce((finalFinalResult, stat) => {
          let finalZScore;
          if (key === 'p' && stat === 'sv') {
            finalZScore = pitcherData[key].map(()=>0);
          } else {
            finalZScore = zscore(pitcherData[key].map(stats => stats[stat]));
          }
          if (key === 'rp') {
            if (stat !== 'sv') {
              finalFinalResult[stat] = finalZScore.map(s => s * 0.7);
            } else {
              finalFinalResult[stat] = finalZScore;
            }
          } else {
            finalFinalResult[stat] = finalZScore;
          }
          
          return finalFinalResult;
        }, {});
        const totalZscores = zscores.so.map((value, index) => getzscoreAtIndex(zscores, index, pitcherAttributes));
        finalResult[key] = totalZscores;
        return finalResult;
      }, {});

      const zData = Object.keys(data).reduce((finalResult, key) => {
        const zscores = attributes.reduce((finalFinalResult, stat) => {
          const finalZScore = zscore(data[key].map(stats => stats[stat]));
          finalFinalResult[stat] = finalZScore;
          return finalFinalResult;
        }, {});
        const totalZscores = zscores.hr.map((value, index) => getzscoreAtIndex(zscores, index));
        finalResult[key] = totalZscores;
        return finalResult;
      }, {});
      const pitcherDataWithZScore = Object.keys(pitcherData).reduce((finalResult, position) => {
        const positionData = pitcherData[position];
        const zDataPosition = pitcherZData[position];
        const players = positionData.map((player, index) => ({ ...player, zscore: zDataPosition[index] }));
        finalResult[position] = players;
        return finalResult;
      }, {});
      const dataWithZScore = Object.keys(data).reduce((finalResult, position) => {
        const positionData = data[position];
        const zDataPosition = zData[position];
        const players = positionData.map((player, index) => ({ ...player, zscore: zDataPosition[index] }));
        finalResult[position] = players;
        return finalResult;
      }, {});
      const dataValue = Object.keys(dataWithZScore).reduce((finalResult, position) => {
        const positionData = dataWithZScore[position];
        const players = positionData.map((player) => {
          // method 1
          const quotient = Math.exp(Math.pow(player.zscore, 0.5)) - 16;

          // method 2
          // const quotient = 8.5 * (player.zscore - 10);

          // method 3
          // const quotient = 3.5 * (player.zscore - 7);

          const value = quotient;
          if (!playersValued[player.playerid] || playersValued[player.playerid] < value) {
            playersValued[player.playerid] = value > 0 ? value : 0;
          }
          return ({ ...player, value });
        });
        finalResult[position] = players;
        return finalResult;
      }, {});
      const pitcherDataValue = Object.keys(pitcherDataWithZScore).reduce((finalResult, position) => {
        const positionData = pitcherDataWithZScore[position];
        const players = positionData.map((player) => {
          // method 1
          const quotient = Math.exp(Math.pow(player.zscore, 0.5)) - 16;

          // method 2
          // const quotient = 8.5 * (player.zscore - 10);

          // method 3
          // const quotient = 3.5 * (player.zscore - 7);

          const value = quotient;
          if (!pitchersValued[player.playerid] || pitchersValued[player.playerid] < value) {
            pitchersValued[player.playerid] = value > 0 ? value : 0;
          }
          return ({ ...player, value });
        });
        finalResult[position] = players;
        return finalResult;
      }, {});
      console.log('TotalValue', Object.keys(playersValued).reduce((finalResult, pid) => {
        finalResult += playersValued[pid];
        return finalResult;
      }, 0));
      console.log('TotalPitchingValue', Object.keys(pitchersValued).reduce((finalResult, pid) => {
        finalResult += pitchersValued[pid];
        return finalResult;
      }, 0));
      this.setState({
        players: {
          data: {
            ...dataValue,
            all: positions.reduce((finalResult, position) => {
              return finalResult.concat(dataValue[position]);
            }, []),
          },
        },
        pitchers: {
          data: {
            ...pitcherDataValue,
            allPitchers: pitcherPositions.reduce((finalResult, position) => {
              return finalResult.concat(pitcherDataValue[position]);
            }, []),
          },
        },
      });
    });
  }
  getFinalData = () => {
    return this.state.players.data[this.state.position];
  }
  getFinalPitcherData = () => {
    return this.state.pitchers.data[this.state.position];
  }
  render() {    
    return (<div>
      <ul className="nav nav-tabs">
        {
          tables.map(name => <li key={name} role="presentation">
            <a href="#" onClick={ this.changePosition.bind(this, name) }>{name}</a>
          </li>
          )
        }
      </ul>
      {
        pitcherPositionsObj[this.state.position] ? <PitcherPosition data={this.getFinalPitcherData()} /> : <Position data={this.getFinalData()} />
      }
      
      
    </div>);
  }
  changePosition = (position) => {
    this.setState({
      position,
    });
  }
}


export default MainContainer;
