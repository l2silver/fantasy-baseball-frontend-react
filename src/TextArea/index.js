// @flow
import React from 'react';
import {debounce} from 'lodash'

export default class TextArea extends React.PureComponent {
  constructor(props){
    super(props)
    this.debHandleChange = debounce(this.props.onChange, 500);
  }
  handleChange = (e)=>{
    return this.debHandleChange(e.target.value);
  }
  render(){
    return <textarea {...this.props} onChange={this.handleChange} />;
  }
}