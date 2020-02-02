import { TSESLint } from "@typescript-eslint/experimental-utils";
import * as rule from "../../../src/rules/no-falsy-and";
import {
  RuleModule,
  RunTests
} from "@typescript-eslint/experimental-utils/dist/ts-eslint";

const parserPath = require.resolve("@typescript-eslint/parser");
const tsconfigPath = require.resolve("../../../tsconfig.json");

const ruleTester = new TSESLint.RuleTester({
  parser: parserPath,
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
    project: tsconfigPath
  }
});

const tests: RunTests<"jsxNumber&&" | "jsxString&&", []> = {
  valid: [
    {
      code: `
const jsx = <div />;
    `
    },
    {
      code: `
const thing = {}
const jsx = (
  <div>
    {thing && <div />}
  </div>
)
      `
    },
    {
      code: `
let thing: boolean = true
const jsx = (
  <div>
    {thing && <div />}
  </div>
)
      `
    },
    {
      code: `
let thing: string = "hey!"
const jsx = (
  <div>
    {!!thing && <div />}
  </div>
)
      `
    },
    {
      code: `
let thing: string = "hey!"
const jsx = (
  <div>
    {thing}
  </div>
)
      `
    },
    {
      code: `
let thing: string = "hey!"
const otherThing = thing && <div />
      `
    },
    {
      code: `
let thing: number = 20
const jsx = (
  <div>
    {!!thing && <div />}
  </div>
)
      `
    },
    {
      code: `
let thing: number = 20
const otherThing = thing && <div />
      `
    },
    {
      code: `
function Component(props: {
  objOrNull: {} | null;
  nested: { obj: {}; nullOrUndef: null | undefined }
}) {
  const jsx = (
    <div>
      {objOrNull && <div />}
      {nested && <div />}
      {nested.obj && <div />}
      {nested.nullOrUndef && <div />}
    </div>
  )
}
      `
    },
    {
      code: `
function Component(props: {
  objOrNull: {} | null;
  str: string;
}) {
  return (
    <div>
      {props.objOrNull && props.str}
    </div>
  )
}
      `
    }
  ],
  invalid: [
    {
      code: `
let thing: string = "hey!"
const jsx = (
  <div>
    {thing && <div />}
  </div>
)
    `,
      errors: [
        {
          messageId: "jsxString&&",
          line: 5,
          endLine: 5,
          column: 6,
          endColumn: 11
        }
      ]
    },
    {
      code: `
const myObj = { thing: "hello" }
const jsx = (
  <div>
    {myObj.thing && <div />}
  </div>
)
      `,
      errors: [
        {
          messageId: "jsxString&&",
          line: 5,
          endLine: 5,
          column: 6,
          endColumn: 17
        }
      ]
    },
    {
      code: `
function MyComponent(props: { prop: string | null }) {
  return (
    <div>
      {props.prop && <div />}
    </div>
  )
}
      `,
      errors: [
        {
          messageId: "jsxString&&",
          line: 5,
          endLine: 5,
          column: 8,
          endColumn: 18
        }
      ]
    },
    {
      code: `
let thing: number = 20
const jsx = (
  <div>
    {thing && <div />}
  </div>
)
    `,
      errors: [
        {
          messageId: "jsxNumber&&",
          line: 5,
          endLine: 5,
          column: 6,
          endColumn: 11
        }
      ]
    },
    {
      code: `
let str: string = "hello"
let nullish: {} | null = {}
const jsx = (
  <div>
    {nullish && str && <div />}
  </div>
)
    `,
      errors: [
        {
          messageId: "jsxString&&",
          line: 6,
          endLine: 6
        }
      ]
    },
    {
      code: `
function Component(props: {
  objOrNull: {} | null;
  str: string;
}) {
  return (
    <div>
      {props.str && props.objOrNull}
    </div>
  )
}
      `,
      errors: [
        {
          messageId: "jsxString&&",
          line: 8,
          endLine: 8,
          column: 8,
          endColumn: 17
        }
      ]
    },
    {
      code: `
function Component(props: {
  stringOrNull: string | null | undefined;
}) {
  return (
    <div>
      {props.stringOrNull && "text"}
    </div>
  )
}
      `,
      errors: [
        {
          messageId: "jsxString&&",
          line: 7,
          endLine: 7,
          column: 8,
          endColumn: 26
        }
      ]
    },
    {
      code: `
function Component(props: {
  numberOrNull: number | null | undefined;
}) {
  return (
    <div>
      {props.numberOrNull && "text"}
    </div>
  )
}
      `,
      errors: [
        {
          messageId: "jsxNumber&&",
          line: 7,
          endLine: 7,
          column: 8,
          endColumn: 26
        }
      ]
    },
    {
      code: `
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
      {props.num && <ComponentX /> /* error */}
    </div>
  );
}
      `,
      errors: [
        {
          messageId: "jsxString&&",
          line: 10,
          endLine: 10
        },
        {
          messageId: "jsxString&&",
          line: 12,
          endLine: 12
        },
        {
          messageId: "jsxNumber&&",
          line: 14,
          endLine: 14
        }
      ]
    }
  ]
};

tests.valid.forEach(test => {
  if (typeof test !== "string") {
    test.parser = parserPath;
    test.filename = require.resolve("../../fixtures/file.tsx");
  }
});
tests.invalid.forEach(test => {
  if (typeof test !== "string") {
    test.parser = parserPath;
    test.filename = require.resolve("../../fixtures/file.tsx");
  }
});

ruleTester.run(
  "no-falsy-and",
  rule as RuleModule<"jsxNumber&&" | "jsxString&&", []>,
  tests
);
