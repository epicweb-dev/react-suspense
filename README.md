<p align="center">
  <a href="https://codefund.io/properties/507/visit-sponsor">
    <img src="https://codefund.io/properties/507/sponsor" />
  </a>
</p>

# Concurrent React

> Improving UX with a faster, more predictable app.

👋 hi there! My name is [Kent C. Dodds](https://kentcdodds.com)! This is a
workshop repo to teach you the fundamentals of React's (EXPERIMENTAL)
[concurrent mode](https://reactjs.org/concurrent). This feature enables React to
make your app faster out of the box and it comes along with a few features that
you can use to improve your app's user experience (most notably the concept of
"Suspense").

[![Build Status][build-badge]][build]
[![AppVeyor Build Status][win-build-badge]][win-build]
[![Code Coverage][coverage-badge]][coverage]
[![GPL 3.0 License][license-badge]][license]
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]

## ⚠️ Warning ⚠️

This workshop material deals with **EXPERIMENTAL** features in React. Please do
not copy/paste any of the code you find here into a production application and
expect it to work. Even when the features are released they may not work the
same as demonstrated in this workshop material.

That said, the concepts in this workshop will very likely be applicable when
these features are stable, so enjoy the workshop!

## Pre-Workshop Instructions/Requirements

In order for us to maximize our efforts during the workshop, please do the
following:

- [ ] Setup the project (follow the setup instructions below) (~5 minutes)
- [ ] Install and setup [Zoom](https://zoom.us) on the computer you will be
      using (~5 minutes)
- [ ] Install the React DevTools
      ([Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
      (recommended),
      [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/))
- [ ] Watch
      [Use Zoom for KCD Workshops](https://egghead.io/lessons/egghead-use-zoom-for-kcd-workshops)
      (~8 minutes).
- [ ] Watch
      [Setup and Logistics for KCD Workshops](https://egghead.io/lessons/egghead-setup-and-logistics-for-kcd-workshops)
      (~24 minutes). Please do NOT skip this step.
- [ ] Watch Dan Abramov's talk
      [Beyond React 16 | JSConf Iceland 2018](https://www.youtube.com/watch?v=nLF0n9SACd4)
      (33 minutes)
- [ ] Go through my
      [Learn React Hooks Workshop](https://kentcdodds.com/workshops/hooks), or
      have the equivalent basic experience of using hooks. You should be
      experienced with `useState`, `useEffect`, and `useRef`.
- [ ] Go through my
      [Advanced React Hooks Workshop](https://kentcdodds.com/workshops/advanced-react-hooks),
      or have the equivalent experience. You should be experienced with
      `useContext` and `useReducer` (experience with `useMemo` and `useCallback`
      is a bonus).

The more prepared you are for the workshop, the better it will go for you.

## Workshop Outline

Here are the concepts we'll be covering:

- Opting into React Concurrent Mode
- Thinking in Suspense
- The fundamentals of "suspending"
- Structuring `<React.Suspense />` components with fallbacks
- Using `useTransition`
- Refactor an existing async interaction to suspense
- The difference between the three data-fetching approaches:
  - Fetch-on-Render (not using Suspense)
  - Fetch-Then-Render (not using Suspense)
  - Render-as-You-Fetch (using Suspense)
- Using `<React.SuspenseList />` to coordinate multiple suspending components

## System Requirements

- [git][git] v2 or greater
- [NodeJS][node] v8 or greater
- [yarn][yarn] v1 or greater (or [npm][npm] v6 or greater)

All of these must be available in your `PATH`. To verify things are set up
properly, you can run this:

```shell
git --version
node --version
yarn --version # or npm --version
```

If you have trouble with any of these, learn more about the PATH environment
variable and how to fix it here for [windows][win-path] or
[mac/linux][mac-path].

## Setup

For many of my workshops, you should be able to run them
[entirely in the browser](https://codesandbox.io/s/github/kentcdodds/concurrent-react).
However for this one, I recommend you work through the workshop on your own
computer.

To do so, please follow these instructions.

After you've made sure to have the correct things (and versions) installed (as
indicated above), you should be able to just run a few commands to get set up:

```
git clone https://github.com/kentcdodds/concurrent-react.git
cd concurrent-react
npm run setup --silent
```

This may take a few minutes. **It will ask you for your email.** This is
optional and just automatically adds your email to the links in the project to
make filling out some forms easier If you get any errors, please read through
them and see if you can find out what the problem is. You may also want to look
at [Troubleshooting](#troubleshooting). If you can't work it out on your own
then please [file an issue][issue] and provide _all_ the output from the
commands you ran (even if it's a lot).

## Running the app

To get the app up and running (and really see if it worked), run:

```shell
npm start
```

This should start up your browser. If you're familiar, this is a standard
[react-scripts](https://github.com/facebook/create-react-app) application.

You can also open
[the deployment of the app on Netlify](https://concurrent-react.netlify.com/).

## Running the tests

```shell
npm test
```

This will start [Jest](http://facebook.github.io/jest) in watch mode. Read the
output and play around with it.

**Your goal will be to go into each test, swap the final version for the
exercise version in the import, and make the tests pass**

## Helpful Emoji 🐨 💰 💯 🦉 📜 💣 🚨

Each exercise has comments in it to help you get through the exercise. These fun
emoji characters are here to help you.

- **Kody the Koala Bear** 🐨 will tell you when there's something specific you
  should do
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

## Troubleshooting

<details>

<summary>"npm run setup" command not working</summary>

Here's what the setup script does. If it fails, try doing each of these things
individually yourself:

```
# verify your environment will work with the project
node ./scripts/verify

# install dependencies
npm install

# verify the project is ready to run
npm run build
npm run test:coverage
npm run lint

# automatically fill in your email for the feedback links.
node ./scripts/autofill-feedback-email.js
```

If any of those scripts fail, please try to work out what went wrong by the
error message you get. If you still can't work it out, feel free to [open an
issue][issue] with _all_ the output from that script. I will try to help if I
can.

</details>

## Contributors

Thanks goes to these wonderful people
([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt=""/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/concurrent-react/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/concurrent-react/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kentcdodds/concurrent-react/commits?author=kentcdodds" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Hypnosphi"><img src="https://avatars3.githubusercontent.com/u/6651625?v=4" width="100px;" alt=""/><br /><sub><b>Filipp Riabchun</b></sub></a><br /><a href="https://github.com/kentcdodds/concurrent-react/commits?author=Hypnosphi" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind welcome!

## License

This material is available for private, non-commercial use under the
[GPL version 3](http://www.gnu.org/licenses/gpl-3.0-standalone.html). If you
would like to use this material to conduct your own workshop, please contact me
at kent@doddsfamily.us

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/
[yarn]: https://yarnpkg.com/
[build-badge]:
  https://img.shields.io/travis/kentcdodds/concurrent-react.svg?style=flat-square&logo=travis
[build]: https://travis-ci.org/kentcdodds/concurrent-react
[license-badge]:
  https://img.shields.io/badge/license-GPL%203.0%20License-blue.svg?style=flat-square
[license]:
  https://github.com/kentcdodds/concurrent-react/blob/master/README.md#license
[prs-badge]:
  https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]:
  https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]:
  https://github.com/kentcdodds/concurrent-react/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]:
  https://img.shields.io/github/watchers/kentcdodds/concurrent-react.svg?style=social
[github-watch]: https://github.com/kentcdodds/concurrent-react/watchers
[github-star-badge]:
  https://img.shields.io/github/stars/kentcdodds/concurrent-react.svg?style=social
[github-star]: https://github.com/kentcdodds/concurrent-react/stargazers
[twitter]:
  https://twitter.com/intent/tweet?text=Check%20out%20concurrent-react%20by%20@kentcdodds%20https://github.com/kentcdodds/concurrent-react%20%F0%9F%91%8D
[twitter-badge]:
  https://img.shields.io/twitter/url/https/github.com/kentcdodds/concurrent-react.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[win-path]:
  https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/
[mac-path]: http://stackoverflow.com/a/24322978/971592
[issue]: https://github.com/kentcdodds/concurrent-react/issues/new
[win-build-badge]:
  https://img.shields.io/appveyor/ci/kentcdodds/concurrent-react.svg?style=flat-square&logo=appveyor
[win-build]: https://ci.appveyor.com/project/kentcdodds/concurrent-react
[coverage-badge]:
  https://img.shields.io/codecov/c/github/kentcdodds/concurrent-react.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/concurrent-react
[watchman]: https://facebook.github.io/watchman/docs/install.html
