import * as React from "react";
import { withProps, withRouter } from "../../compose";
import { LogoView, Props } from "./logoView";

const enhancer = (Component: React.ComponentType<Props>) => () =>
  withRouter(routerProps =>
    withProps(
      {
        handleSettings: () => {
          routerProps.history.push("/settings");
        }
      },
      injectedProps => <Component {...injectedProps} />
    )
  );

export const Logo = enhancer(LogoView);
