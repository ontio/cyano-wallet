import { get } from "lodash";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { GlobalState } from "../../redux";
import { reduxConnect, withProps } from "../../compose";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { delToken } from "../../redux/settings/settingsActions";
import { Props, TokenSettingsDelView } from "./tokenSettingsDelView";

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      delToken,
      finishLoading,
      startLoading
    },
    dispatch
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const contract: string = get(props.location, "state.contract");

    return withProps(
      {
        contract,
        handleCancel: async () => {
          props.history.goBack();
        },
        handleConfirm: async () => {
          await actions.startLoading();

          await actions.delToken(contract);
          await actions.finishLoading();

          props.history.push("/settings/token");
        },
        loading: reduxProps.loading
      },
      injectedProps => <Component {...injectedProps} />
    );
  });

export const TokenSettingsDel = enhancer(TokenSettingsDelView);
