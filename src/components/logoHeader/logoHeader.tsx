import * as React from "react";
import { withProps, withRouter } from "../../compose";
import { LogoHeaderView, Props } from "./logoHeaderView";

interface OuterProps {
  showLogout: boolean;
  showSettings?: boolean;
  showAccounts: boolean;
  title: string;
}

const enhancer = (Component: React.ComponentType<Props>) => (props: OuterProps) =>
  withRouter(routerProps =>
    withProps(
      {
        handleAccounts: () => {
          routerProps.history.push("/account/change");
        },
        handleSettings: () => {
          routerProps.history.push("/settings");
        }
      },
      injectedProps => (
        <Component
          {...injectedProps}
          title={props.title}
          showLogout={props.showLogout}
          showAccounts={props.showAccounts}
          showSettings={props.showSettings !== undefined ? props.showSettings : true}
        />
      )
    )
  );

interface TitleOuterProps {
  title: string;
}

export const LogoHeader = enhancer(LogoHeaderView);

export const AccountLogoHeader = (props: TitleOuterProps) => (
  <LogoHeader showAccounts={true} showSettings={true} title={props.title} showLogout={true} />
);
