import "babel-polyfill";

import * as Ledger from "@ont-community/ontology-ts-sdk-ledger";
import { Crypto } from "ontology-ts-sdk";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "./global.css";

import { Provider } from "react-redux";
import { MemoryRouter as Router, Route } from "react-router-dom";
import { BalanceProvider, StatusBar } from "./components";
import {
  Clear,
  Create,
  Dashboard,
  Home,
  Import,
  LedgerCreate,
  LedgerImport,
  LedgerNew,
  LedgerSendConfirm,
  LedgerSignup,
  New,
  Receive,
  Restore,
  Send,
  SendComplete,
  SendConfirm,
  SendFailed,
  SettingsPage,
  Signup,
  Transfers,
  WithdrawComplete,
  WithdrawConfirm,
  WithdrawFailed
} from "./pages";
import { initNetwork } from "./network";
import { reduxStore } from "./redux";

initNetwork(reduxStore);

Crypto.registerKeyDeserializer(new Ledger.LedgerKeyDeserializer());
Ledger.setLedgerTransport(
  new Ledger.LedgerTransportIframe("https://drxwrxomfjdx5.cloudfront.net/forwarder.html", true)
);

export const AppView: React.SFC<{}> = () => (
  <Provider store={reduxStore}>
    <Router>
      <>
        <BalanceProvider />
        <Route path="/dashboard" exact={true} component={Dashboard} />
        <Route path="/send" exact={true} component={Send} />
        <Route path="/sendConfirm" exact={true} component={SendConfirm} />
        <Route path="/sendComplete" exact={true} component={SendComplete} />
        <Route path="/sendFailed" exact={true} component={SendFailed} />
        <Route path="/settings" exact={true} component={SettingsPage} />
        <Route path="/receive" exact={true} component={Receive} />
        <Route path="/transfers" exact={true} component={Transfers} />
        <Route path="/withdrawConfirm" exact={true} component={WithdrawConfirm} />
        <Route path="/withdrawComplete" exact={true} component={WithdrawComplete} />
        <Route path="/withdrawFailed" exact={true} component={WithdrawFailed} />

        <Route path="/" exact={true} component={Home} />
        <Route path="/new" exact={true} component={New} />
        <Route path="/clear" exact={true} component={Clear} />
        <Route path="/restore" exact={true} component={Restore} />
        <Route path="/import" exact={true} component={Import} />
        <Route path="/create" exact={true} component={Create} />
        <Route path="/sign-up" exact={true} component={Signup} />

        <Route path="/ledger/create" exact={true} component={LedgerCreate} />
        <Route path="/ledger/import" exact={true} component={LedgerImport} />
        <Route path="/ledger/new" exact={true} component={LedgerNew} />
        <Route path="/ledger/sendConfirm" exact={true} component={LedgerSendConfirm} />
        <Route path="/ledger/signup" exact={true} component={LedgerSignup} />
        <StatusBar />
      </>
    </Router>
  </Provider>
);

ReactDOM.render(<AppView />, document.getElementById("root") as HTMLElement);
