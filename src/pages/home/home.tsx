/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as React from "react";
import { RouterProps } from "react-router";
import { GlobalState } from "../../redux";
// import { bindActionCreators, Dispatch } from "redux";
// import { getStoredWallet } from "../../api/authApi";
import { dummy, lifecycle, reduxConnect } from "../../compose";
// import { setWallet } from "../../redux/auth/authActions";

// const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setWallet }, dispatch);
const mapStateToProps = (state: GlobalState) => ({
  wallet: state
});

const enhancer = (Component: React.ComponentType<{}>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, dummy, (reduxProps, actions) =>
    lifecycle(
      {
        componentDidMount: async () => {
          // const wallet = await getStoredWallet();
          console.log("reduxProps", reduxProps);
          if (reduxProps.wallet != null) {
            console.log("home");
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
