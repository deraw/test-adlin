# ADLIN Test

This is a technical test for the ADLIN company. The goal of the test is to create a simple web application to book meeting rooms.

## Notes and thoughts

- I've used Vuetify for the UI components to get a chance to play with version 3 a bit and to gain time on the UI.
- I've added IDs to the items in the list of rooms to be able to identify them in a more reliable way.
- I've added simple unit and end-to-end tests to demonstrate that they're configured and working. I didn't have time to write tests for all the components, but I wrote a few to show that I know how to do it.
- Ideally the UI should be a bit more polished and the UX should be improved, but I had to focus on the main functionality of the app. It would be great to also ensure that the UI is able to handle the different edge cases that could happen.
- Ideally the back-end should remove the bookings as they expire so that the list of bookings is up to date.
- I worked on the main branch and didn't create atomic commits, it was easier to work this way as I was working alone.
- I also would have liked to setup a proper lint configuration with Git Hooks, to configure a proper logger and so on!

## Front-End

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

#### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Back-End

### Project Setup

```sh
npm install
```

### Run the server

```sh
npm run start
```
