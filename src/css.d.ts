// Allow importing .css files as string modules (handled by Rollup css-string plugin)
declare module '*.css' {
  const content: string;
  export default content;
}
