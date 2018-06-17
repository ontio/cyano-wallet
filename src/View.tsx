import * as React from 'react';

interface Props {
  orientation?: 'row' | 'column';

  content?: boolean;
  fluid?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const View: React.SFC<Props> = (props) => {
  let className = 'flex';

  if (props.orientation) {
    className += ' ' + props.orientation;
  }

  if (props.fluid) {
    className += ' ' + 'full';
  }

  if (props.content) {
    className += ' ' + 'content';
  }

  if (props.className) {
    className += ' ' + props.className;
  }

  return (
    <div className={className}>
      {props.children}
    </div>
  );
};

export const Spacer: React.SFC<{}> = () => (
  <View className="spacer"/>
);

export const Filler: React.SFC<{}> = () => (
  <View className="filler"/>
);
