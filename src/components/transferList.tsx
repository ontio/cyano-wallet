import { format } from 'date-fns';
import * as React from 'react';
import { List, Loader } from 'semantic-ui-react';
import { Transfer } from '../api/explorerApi';
import { View } from './view';


interface Props {
  transfers: Transfer[] | null;
  ownAddress: string;
}

export const TransferList: React.SFC<Props> = (props) => (
  <View>
    {props.transfers === null ? (
      <Loader active={true} inline={true} />
    ) : (
        <List className="transferList" divided={true}>
          {props.transfers.map(transfer => (
            <List.Item>
              <List.Icon name={transfer.from === props.ownAddress ? 'arrow alternate circle down outline' : 'arrow alternate circle up outline'} size="large" verticalAlign="middle" />
              <List.Content>
                <List.Header>{transfer.from === props.ownAddress ? '-' : ''}{transfer.amount} {transfer.asset}</List.Header>
                <List.Description>{transfer.to}</List.Description>
                <List.Description>{format(transfer.time * 1000, 'MMM Do YYYY HH:mm:ss')}</List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      )}
  </View>
);
