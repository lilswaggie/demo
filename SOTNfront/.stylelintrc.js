module.exports = {
  "extends": ["stylelint-config-standard", "stylelint-config-prettier"],
  "plugins": [
    "stylelint-scss"
  ],
  "ignoreFiles": ["**/*.js", '**/*/jsx'],
  "rules": {
    "comment-empty-line-before": null,
    "declaration-empty-line-before": null,
    "function-name-case": null,
    "selector-pseudo-element-colon-notation": null,
    "no-invalid-double-slash-comments": null,
    "no-descending-specificity": null,
    "font-family-no-missing-generic-family-keyword": null
  },
  "stylelint.syntax": "scss",
  "stylelint.fix": true,
}
