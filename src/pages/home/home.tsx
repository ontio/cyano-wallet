import * as React from "react";
import { RouterProps } from "react-router";
import { GlobalState } from "../../redux";
// import { bindActionCreators, Dispatch } from "redux";
// import { getStoredWallet } from "../../api/authApi";
import { dummy, lifecycle, reduxConnect } from "../../compose";
// import { setWallet } from "../../redux/auth/authActions";

// const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setWallet }, dispatch);
const mapStateToProps = (state: GlobalState) => ({
  wallet: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<{}>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, dummy, (reduxProps, actions) =>
    lifecycle(
      {
        componentDidMount: async () => {
          // const wallet = await getStoredWallet();
          console.log("HOME reduxProps", reduxProps);
          if (reduxProps.wallet != null) {
            // actions.setWallet(wallet);
            props.history.push("/dashboard");
          } else {
            props.history.push("/sign-up");
          }
        }
      },
      () => <Component />
    )
  );

export const Home = enhancer(() => null);
