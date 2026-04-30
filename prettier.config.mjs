export default {
  plugins: ["@prettier/plugin-xml", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.xml",
      options: {
        parser: "xml",
        bracketSameLine: false,
        singleAttributePerLine: true,
      },
    },
  ],
  singleQuote: false,
  trailingComma: "all",
  semi: true,
};
