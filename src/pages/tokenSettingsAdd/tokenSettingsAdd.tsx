import { get } from "lodash";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { GlobalState } from "../../redux";
import { reduxConnect, withProps } from "../../compose";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { addToken } from "../../redux/settings/settingsActions";
import { Props, TokenSettingsAddView } from "./tokenSettingsAddView";
import { getOEP4Token } from "../../api/tokenApi";

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addToken,
      finishLoading,
      startLoading
    },
    dispatch
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
    withProps(
      {
        handleCancel: async () => {
          props.history.goBack();
        },
        handleConfirm: async (values: object) => {
          const contract: string = get(values, "contract");

          await actions.startLoading();

          try {
            const token = await getOEP4Token(contract);
            console.log("token", token);

            // const token = {
            //   contract,
            //   decimals: 9,
            //   name: "LUCKY",
            //   specification: "OEP-4",
            //   symbol: "LCY"
            // };

            await actions.addToken(contract, token.name, token.symbol, token.decimals, "OEP-4");

            await actions.finishLoading();

            props.history.push("/settings/token");

            return {};
          } catch (e) {
            await actions.finishLoading();

            return {
              contract: "Invalid contract"
            };
          }
        },
        loading: reduxProps.loading
      },
      injectedProps => <Component {...injectedProps} />
    )
  );

export const TokenSettingsAdd = enhancer(TokenSettingsAddView);
