import React from 'react';

interface Props {
  event: any;
  title: string;
}

/**
 * It will helps to display `title` as well as the `value` on BigCalender
 */
export default class CustomEvent extends React.Component<Props> {
  extractValue = (value: string) => {
    const { predefinedValue } = this.props.event;
    const output = predefinedValue && predefinedValue.find((x: any) => x.value === value);
    return (
      (output &&
        output.key
          .concat(' [')
          .concat(value)
          .concat(']')) ||
      value
    );
  };

  render() {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>{this.props.title}</span>
        {this.props.title && <br />}
        <span style={{ fontSize: 10 }}>{this.extractValue(this.props.event.value)}</span>
      </div>
    );
  }
}
