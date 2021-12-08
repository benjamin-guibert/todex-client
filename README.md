# Token Decentralised Exchange

> Token decentralised exchange where you can deposit & withdraw tokens, make
> orders and trades (client).

[![license-shield][]](LICENSE)
[![test-shield][]][test-link]
![last-commit-shield][]

## Development

See [`package.json`](package.json) for the list of available scripts.

### Prerequisites

This project require the following dependencies:

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com)

### Setup

Install the dependencies and the `.env` file (set the contract addresses):

```bash
cp .env.sample .env
yarn install
```

### Usage

Run the client locally in development mode:

```bash
yarn start
```

The application will be available from `http://localhost:3000` by default.

### Deployment

The application can be built:

```bash
yarn build
```

Deployed files are located in the `dist` repository.

### Contributing

This project is not currently open to contributions.

## Built With

[Node.js](https://nodejs.org)
, [Yarn](https://yarnpkg.com)
, [TypeScript](https://www.typescriptlang.org)
, [React](https://reactjs.org)
, [Eslint](https://eslint.org)
, [Prettier](https://prettier.io)
, [Jest](https://jestjs.io)
, [styled-components](https://styled-components.com)
, [Ethers](https://docs.ethers.io/)
, [metamask/detect-provider](https://github.com/MetaMask/detect-provider)
, [Lodash](https://lodash.com)
, [Numeral.js](http://numeraljs.com)
, [Moment.js](https://momentjs.com)
, [Bootstrap](https://getbootstrap.com)
, [React Bootstrap](https://react-bootstrap.github.io)

## Release History

Check the [`CHANGELOG.md`](CHANGELOG.md) file for the release history.

## Versionning

We use [SemVer](http://semver.org/) for versioning. For the versions available,
see the [tags on this repository][tags-link].

## Authors

- **[Benjamin Guibert](https://github.com/benjamin-guibert)**: Creator & main
  contributor

See also the list of [contributors][contributors-link] who participated in this
project.

## License

[![license-shield][]](LICENSE)

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE)
file for details.

[contributors-link]: https://github.com/benjamin-guibert/todex-client/contributors
[license-shield]: https://img.shields.io/github/license/benjamin-guibert/todex-client.svg
[test-shield]: https://img.shields.io/github/workflow/status/benjamin-guibert/todex-client/Test
[test-link]: https://github.com/benjamin-guibert/todex-client/actions/workflows/test.yml
[last-commit-shield]: https://img.shields.io/github/last-commit/benjamin-guibert/todex-client
