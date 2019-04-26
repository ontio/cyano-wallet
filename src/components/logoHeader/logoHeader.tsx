import * as React from "react";
import { withProps, withRouter } from "../../compose";
import { LogoHeaderView, Props } from "./logoHeaderView";

interface OuterProps {
  showSettings?: boolean;
  showAccounts?: boolean;
  showLogout?: boolean;
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
        },
        handleInvestorLogin: () => {
          routerProps.history.push("/investor-login");
        }
      },
      injectedProps => (
        <Component
          {...injectedProps}
          title={props.title}
          showAccounts={props.showAccounts === true}
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
  <LogoHeader showAccounts={true} showSettings={true} title={props.title} />
);
