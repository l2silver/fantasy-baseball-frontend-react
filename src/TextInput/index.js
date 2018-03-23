// @flow
import React from 'react';
import {debounce} from 'lodash';
import styles from './style.pcss';

export default class TextInput extends React.PureComponent {
  constructor(props){
    super(props)
    this.debHandleChange = debounce(this.props.onChange, 500);
  }
  handleChange = (e)=>{
    return this.debHandleChange(e.target.value);
  }
  render(){
    return <input type="text" className={styles.width} {...this.props} onChange={this.handleChange} />;
  }
}