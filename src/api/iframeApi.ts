import { timeout } from 'promise-timeout';

export interface ChannelMessage {
  id: string;
}

const channel: MessageChannel = new MessageChannel();

export async function createChannel() {
  
  const promise = new Promise<void>((resolve, reject) => {
    const iframe: HTMLIFrameElement | null = document.querySelector('#ledger-forwarder');

    if (iframe == null || iframe.contentWindow == null) {
      reject('Can not find Ledger forwarder IFrame');
      return;
    }

    const ready = (message: any) => {
      if (message.data === 'ready') {
        channel.port1.removeEventListener('message', ready);
        resolve();
      } else {
        // tslint:disable-next-line:no-console
        console.error('First event on iframe port was not "ready"');
      }
    };
    channel.port1.addEventListener('message', ready);
    channel.port1.start();

    iframe.addEventListener('load', () => {
      if (iframe == null || iframe.contentWindow == null) {
        reject('Can not find Ledger forwarder IFrame.');
        return;
      }

      iframe.contentWindow.postMessage('init', '*', [channel.port2]);
    });
  });

  return timeout(promise, 2000);
}

export async function sendToChannel<T extends ChannelMessage>(msg: T, timeoutMs = 2000) {
  const promise = new Promise<ChannelMessage>((resolve) => {

    const listener = (result: MessageEvent) => {
      const data = result.data as ChannelMessage;

      if (data.id === msg.id) {
        channel.port1.removeEventListener('message', listener);
        resolve(data);
      }
    }

    channel.port1.addEventListener('message', listener);
    channel.port1.postMessage(msg);
  });

  return timeout(promise, timeoutMs);
};
