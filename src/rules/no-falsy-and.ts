import {
  ESLintUtils,
  AST_NODE_TYPES
} from "@typescript-eslint/experimental-utils";
import * as ts from "typescript";
import * as tsutils from "tsutils";

const createRule = ESLintUtils.RuleCreator(() => "");

module.exports = createRule<[], "jsxNumber&&" | "jsxString&&">({
  name: "no-falsy-and",
  defaultOptions: [],
  meta: {
    type: "problem",
    docs: {
      description:
        "Prevent boolean expressions from adding unwanted falsy strings/numbers to your JSX",
      category: "Possible Errors",
      recommended: "error",
      requiresTypeChecking: true
    },
    messages: {
      "jsxString&&": 'This expression could evaluate to "".',
      "jsxNumber&&": "This expression could evaluate to 0."
    },
    schema: []
  },
  create(context) {
    return {
      LogicalExpression: expr => {
        if (expr.operator !== "&&") return;
        if (
          !expr.parent ||
          expr.parent.type !== AST_NODE_TYPES.JSXExpressionContainer
        ) {
          return;
        }
        const service = context.parserServices;
        const checker = service?.program?.getTypeChecker();
        const tsNode = service?.esTreeNodeToTSNodeMap?.get(expr.left);
        if (!checker || !tsNode) {
          throw new Error("Parser service not available!");
        }
        const leftNodeType = checker.getTypeAtLocation(tsNode);
        const constrainedType = checker.getBaseConstraintOfType(leftNodeType);
        const type = constrainedType ?? leftNodeType;

        let isLeftNodeString = tsutils.isTypeFlagSet(
          type,
          ts.TypeFlags.StringLike
        );
        let isLeftNodeNumber = tsutils.isTypeFlagSet(
          type,
          ts.TypeFlags.NumberLike
        );
        if (
          !isLeftNodeString &&
          !isLeftNodeNumber &&
          tsutils.isTypeFlagSet(type, ts.TypeFlags.Union)
        ) {
          for (const ty of (type as ts.UnionType).types) {
            if (tsutils.isTypeFlagSet(ty, ts.TypeFlags.StringLike)) {
              isLeftNodeString = true;
              break;
            } else if (tsutils.isTypeFlagSet(ty, ts.TypeFlags.NumberLike)) {
              isLeftNodeNumber = true;
              break;
            }
          }
        }
        if (isLeftNodeString) {
          context.report({
            node: expr.left,
            messageId: "jsxString&&"
          });
        } else if (isLeftNodeNumber) {
          context.report({
            node: expr.left,
            messageId: "jsxNumber&&"
          });
        }
      }
    };
  }
});
