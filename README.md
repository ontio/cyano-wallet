# Ontology ID & Wallet



<p>
  <img width="300px" src="/wallet.png">
</p>

## Overview

WebExtension (a.k.a Chrome plugin) wallet for the **Ontology** blockchain compatible with Chrome and Firefox.

### What does it currently do

* Create a wallet using mnemonics phrase
* Encrypt a Private Key
* Login with Mnemonics phrase, Private Key or a stored account.
* View balance
* Send ONG and ONT
* Withdraw (claim) ONG
* Switch networks (Test/Main/Private)

## Installation

Plugins are not yet distributed to browser stores, to build manually see the steps below.

### Required Tools and Dependencies

* Node
* Yarn (https://yarnpkg.com/lang/en/docs/install/)

### Developing and Running

Execute these commands in the project's root directory:

Setup:

#### Install yarn
For faster building process and development experience install Yarn

```
npm install --global yarn
```

#### Download
```
git clone 'https://github.com/backslash47/ontology-plugin-wallet.git'
```

#### Start development server
This will run the wallet as an web application accessible on http://localhost:3000 using web local storage for wallet storage.

````
yarn start
````

#### Build extension
This will build the extension for installation into browsers. 

````
yarn start
````

## Built With

* [TypeScript](https://www.typescriptlang.org/) - Used language
* [Node.js](https://nodejs.org) - JavaScript runtime for building and ingest
* [React](https://reactjs.org/) - The web framework used
* [Semantic UI](https://react.semantic-ui.com/introduction) - The web framework used
* [Elasticsearch](https://www.elastic.co/) - Backend data storage and indexer
* [Ontology TypeScript SDK](https://github.com/ontio/ontology-ts-sdk) - The framework used

## Authors

* **Matus Zamborsky** - *Initial work* - [Backslash47](https://github.com/backslash47)

## License

This project is licensed under the LGPL License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Many thanks to the whole Ontology team, who done a great job bringing Ontology to life.
