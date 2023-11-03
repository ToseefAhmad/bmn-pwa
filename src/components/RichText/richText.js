import React, {Component} from 'react';

const toHTML = str => ({__html: str});

class RichText extends Component {
  render() {
    const {content} = this.props;
    
    return (
      <div dangerouslySetInnerHTML={toHTML(content)}/>
    );
  }
}

export default RichText;
