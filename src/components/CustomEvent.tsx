import React from 'react';

interface Props {
  event: any;
  title: string;
}

/**
 * It will helps to display `title` as well as the `value` on BigCalender
 */
export default class CustomEvent extends React.Component<Props> {
  render() {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>{this.props.title}</span>
        {this.props.title && <br />}
        <span style={{ fontSize: 10 }}>{this.props.event.value}</span>
      </div>
    );
  }
}
