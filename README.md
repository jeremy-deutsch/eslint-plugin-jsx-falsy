# eslint-plugin-jsx-falsy

Avoid accidentally rendering falsy values in your JSX. **Only works with `@typescript-eslint/parser`, and uses type information.**

Exposes a single eslint rule, `no-falsy-and`, that errors if the left side of an inline `&&` expression in JSX is a string or number. These expressions can cause unwanted values to render, and can even cause some crashes in React Native, when the string or number is falsy (`""` or `0`).

## Examples

```tsx
function MyComponent(props: {
  str: string;
  num: number;
  maybeString: string | null;
  maybeObj: {} | null;
}) {
  return (
    <div>
      {props.str && <ComponentX /> /* error */}
      {!!props.str && <ComponentX /> /* no error */}
      {props.maybeString && <ComponentX /> /* error */}
      {props.maybeObj && <ComponentX /> /* no error */}
      {props.num && <ComponentX /> /* no error */}
    </div>
  );
}
```

## Installation

You'll first need to install [ESLint](http://eslint.org) and [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser):

```shell
$ yarn add --dev eslint @typescript-eslint/parser
```

Next, install `eslint-plugin-jsx-falsy`:

```shell
$ yarn add --dev eslint-plugin-jsx-falsy
```

**Note:** If you installed ESLint globally (using `yarn global` or `npm install -g`) then you must also install `eslint-plugin-jsx-falsy` globally.

## Usage

Add `jsx-falsy` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix. Note that the rule won't work unless `project` is specified in `parserOptions`, since this rule uses type information (more details [here](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md)).

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./tsconfig.json"]
  },
  "plugins": ["jsx-falsy"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "jsx-falsy/no-falsy-and": "error"
  }
}
```
