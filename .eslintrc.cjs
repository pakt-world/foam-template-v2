module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "standard-with-typescript",
        "prettier",
        "airbnb",
        "airbnb-typescript",
        "airbnb/hooks",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
        "plugin:@next/next/recommended",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    overrides: [],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        "react/jsx-props-no-spreading": "off",
        "no-undef": "off",
        "no-nested-ternary": "off",
        "import/extensions": "off",
        "no-underscore-dangle": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "no-plusplus": "off",
        "import/prefer-default-export": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-misused-promises": "off", // Event handlers such as onClick, onSubmit, etc., are expected to be void functions, meaning they should not return anything. However, it seems passing a function that returns a Promise to one of these event handlers triggers this error.
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/unbound-method": "off", // Avoid referencing unbound methods which may cause unintentional scoping of `this`.If your function does not access `this`, you can annotate it with `this: void`, or consider using an arrow function instead.
        "react/function-component-definition": [
            2,
            {
                "namedComponents": ["function-declaration", "function-expression", "arrow-function"],
            },
        ],
        "react/require-default-props": "off",
        "import/no-extraneous-dependencies": "off",
        // Bad rules to disable
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "consistent-return": "off",
        "react/no-array-index-key": "off",
        // Temporary rules
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/non-nullable-type-assertion-style": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            node: {
                extensions: [".js", ".ts", ".tsx"],
            },
        },
    },
};
