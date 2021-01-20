<div>
  <h1 align="center"><a href="https://epicreact.dev/suspense">🔀 React Suspense 🚀 EpicReact.Dev</a></h1>
  <strong>
    Simplify your Async UI and improve your User Experience
  </strong>
  <p>
    Learn how Suspense works under the hood, preparing you for the future of asynchronous state management.
  </p>

  <a href="https://epicreact.dev">
    <img
      alt="Learn React from Start to Finish"
      src="https://kentcdodds.com/images/epicreact-promo/er-1.gif"
    />
  </a>
</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![All Contributors][all-contributors-badge]](#contributors)
[![GPL 3.0 License][license-badge]][license]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## ⚠️ Warning ⚠️

This workshop material deals with **EXPERIMENTAL** features in React. Please do
not copy/paste any of the code you find here into a production application and
expect it to work. Even when the features are released they may not work the
same as demonstrated in this workshop material.

That said, the concepts in this workshop will very likely be applicable when
these features are stable, so enjoy the workshop!

## NOTICE:

This workshop deals a lot with error boundaries and it's important to note that
create-react-app has a special and helpful "Error Overlay" component that will
sometimes be displayed when an error occurs (whether your app implements error
boundaries or not). For you to see the error handling within the app, you'll
need to close that overlay by clicking the "x" in the upper-right.

## Prerequisites

- Install the React DevTools
  ([Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
  (recommended),
  [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/))
- Watch Dan Abramov's talk
  [Beyond React 16 | JSConf Iceland 2018](https://www.youtube.com/watch?v=nLF0n9SACd4)
  (33 minutes)
- Experience with React and all hooks

## System Requirements

- [git][git] v2.13 or greater
- [NodeJS][node] `^10.13 || 12 || 14 || 15`
- [npm][npm] v6 or greater

All of these must be available in your `PATH`. To verify things are set up
properly, you can run this:

```shell
git --version
node --version
npm --version
```

If you have trouble with any of these, learn more about the PATH environment
variable and how to fix it here for [windows][win-path] or
[mac/linux][mac-path].

## Setup

> If you want to commit and push your work as you go, you'll want to
> [fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)
> first and then clone your fork rather than this repo directly.

After you've made sure to have the correct things (and versions) installed, you
should be able to just run a few commands to get set up:

```
git clone https://github.com/kentcdodds/react-suspense.git
cd react-suspense
node setup
```

This may take a few minutes. **It will ask you for your email.** This is
optional and just automatically adds your email to the links in the project to
make filling out some forms easier.

If you get any errors, please read through them and see if you can find out what
the problem is. If you can't work it out on your own then please [file an
issue][issue] and provide _all_ the output from the commands you ran (even if
it's a lot).

If you can't get the setup script to work, then just make sure you have the
right versions of the requirements listed above, and run the following commands:

```
npm install
npm run validate
```

If you are still unable to fix issues and you know how to use Docker 🐳 you can
setup the project with the following command:

```
docker-compose up
```

It's recommended you run everything locally in the same environment you work in
every day, but if you're having issues getting things set up, you can also set
this up using [GitHub Codespaces](https://github.com/features/codespaces)
([video demo](https://www.youtube.com/watch?v=gCoVJm3hGk4)) or
[Codesandbox](https://codesandbox.io/s/github/kentcdodds/react-suspense).

## Running the app

To get the app up and running (and really see if it worked), run:

```shell
npm start
```

This should start up your browser. If you're familiar, this is a standard
[react-scripts](https://create-react-app.dev/) application.

You can also open
[the deployment of the app on Netlify](https://react-suspense.netlify.app/).

## Running the tests

```shell
npm test
```

This will start [Jest](https://jestjs.io/) in watch mode. Read the output and
play around with it. The tests are there to help you reach the final version,
however _sometimes_ you can accomplish the task and the tests still fail if you
implement things differently than I do in my solution, so don't look to them as
a complete authority.

### Exercises

- `src/exercise/00.md`: Background, Exercise Instructions, Extra Credit
- `src/exercise/00.js`: Exercise with Emoji helpers
- `src/__tests__/00.js`: Tests
- `src/final/00.js`: Final version
- `src/final/00.extra-0.js`: Final version of extra credit

The purpose of the exercise is **not** for you to work through all the material.
It's intended to get your brain thinking about the right questions to ask me as
_I_ walk through the material.

### Helpful Emoji 🐨 💪 🏁 💰 💯 🦉 📜 💣 👨‍💼 🚨

Each exercise has comments in it to help you get through the exercise. These fun
emoji characters are here to help you.

- **Kody the Koala Bear** 🐨 will tell you when there's something specific you
  should do
- **Matthew the Muscle** 💪 will indicate what you're working with an exercise
- **Chuck the Checkered Flag** 🏁 will indicate that you're working with a final
  version
- **Marty the Money Bag** 💰 will give you specific tips (and sometimes code)
  along the way
- **Hannah the Hundred** 💯 will give you extra challenges you can do if you
  finish the exercises early.
- **Olivia the Owl** 🦉 will give you useful tidbits/best practice notes and a
  link for elaboration and feedback.
- **Dominic the Document** 📜 will give you links to useful documentation
- **Berry the Bomb** 💣 will be hanging around anywhere you need to blow stuff
  up (delete code)
- **Peter the Product Manager** 👨‍💼 helps us know what our users want
- **Alfred the Alert** 🚨 will occasionally show up in the test failures with
  potential explanations for why the tests are failing.

## Contributors

Thanks goes to these wonderful people
([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3?s=100" width="100px;" alt=""/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/react-suspense/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kentcdodds/react-suspense/commits?author=kentcdodds" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Hypnosphi"><img src="https://avatars3.githubusercontent.com/u/6651625?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Filipp Riabchun</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=Hypnosphi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lauchness"><img src="https://avatars0.githubusercontent.com/u/51837850?v=4?s=100" width="100px;" alt=""/><br /><sub><b>lauchness</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=lauchness" title="Code">💻</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/pritamsangani/"><img src="https://avatars3.githubusercontent.com/u/22857896?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pritam Sangani</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=PritamSangani" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/emzoumpo"><img src="https://avatars2.githubusercontent.com/u/2103443?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Emmanouil Zoumpoulakis</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=emzoumpo" title="Documentation">📖</a></td>
    <td align="center"><a href="http://peter.hozak.info/"><img src="https://avatars0.githubusercontent.com/u/1087670?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Peter Hozák</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=Aprillion" title="Code">💻</a></td>
    <td align="center"><a href="http://twitter.com/jcarty"><img src="https://avatars1.githubusercontent.com/u/952914?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jerome Carty</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=jcarty" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://anthonyng.me"><img src="https://avatars1.githubusercontent.com/u/14035529?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anthony Ng</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=newyork-anthonyng" title="Documentation">📖</a></td>
    <td align="center"><a href="https://vk.com/vasilii_kovalev"><img src="https://avatars0.githubusercontent.com/u/10310491?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vasilii Kovalev</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/issues?q=author%3Avasilii-kovalev" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/react-suspense/commits?author=vasilii-kovalev" title="Documentation">📖</a></td>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=MichaelDeBoey" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dsod"><img src="https://avatars0.githubusercontent.com/u/19597385?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel Söderling</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=dsod" title="Documentation">📖</a></td>
    <td align="center"><a href="http://bobbywarner.com"><img src="https://avatars0.githubusercontent.com/u/554961?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bobby Warner</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=bobbywarner" title="Code">💻</a></td>
    <td align="center"><a href="http://angular-tips.com"><img src="https://avatars2.githubusercontent.com/u/1087957?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jesús Rodríguez</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=Foxandxss" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/cesarcf"><img src="https://avatars0.githubusercontent.com/u/5168360?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cesar Carbajo</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=cesarcf" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/waxidiotic"><img src="https://avatars1.githubusercontent.com/u/8037469?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Bussey</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=waxidiotic" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/intrueder"><img src="https://avatars2.githubusercontent.com/u/182339?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tymur Mudzhyri</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/issues?q=author%3Aintrueder" title="Bug reports">🐛</a> <a href="https://github.com/kentcdodds/react-suspense/commits?author=intrueder" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/billfienberg"><img src="https://avatars3.githubusercontent.com/u/6130520?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bill Fienberg</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=billfienberg" title="Documentation">📖</a></td>
    <td align="center"><a href="http://devlogger.wordpress.com"><img src="https://avatars2.githubusercontent.com/u/15407?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Martin Carel</b></sub></a><br /><a href="https://github.com/kentcdodds/react-suspense/commits?author=cawel" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind welcome!

## Workshop Feedback

Each exercise has an Elaboration and Feedback link. Please fill that out after
the exercise and instruction.

At the end of the workshop, please go to this URL to give overall feedback.
Thank you! https://kcd.im/rs-ws-feedback

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/
[build-badge]: https://img.shields.io/github/workflow/status/kentcdodds/react-suspense/validate/main?logo=github&style=flat-square
[build]: https://github.com/kentcdodds/react-suspense/actions?query=workflow%3Avalidate
[license-badge]: https://img.shields.io/badge/license-GPL%203.0%20License-blue.svg?style=flat-square
[license]: https://github.com/kentcdodds/react-suspense/blob/main/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/react-suspense/blob/main/CODE_OF_CONDUCT.md
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[all-contributors-badge]: https://img.shields.io/github/all-contributors/kentcdodds/react-suspense?color=orange&style=flat-square
[win-path]: https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/
[mac-path]: http://stackoverflow.com/a/24322978/971592
[issue]: https://github.com/kentcdodds/react-suspense/issues/new
<!-- prettier-ignore-end -->
