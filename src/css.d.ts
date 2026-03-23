/** Allows importing `.css` files as string modules (handled by the Rollup css-string plugin). */
declare module "*.css" {
  const content: string;
  export default content;
}
