import { Tree } from "./tree";

/**
 * Tree builder configuration options
 */
export interface TreeBuilderConfig {
  /**
   * object key to use as node id
   */
  pk?: string;
  /**
   * object property name that references parent object
   */
  fk: string;
  /**
   * user dependant custom configuration
   */
  extra?: any;
}

/**
 * Tree builder interface
 */
export interface TreeBuilderInterface<E = unknown> {
  /**
   * Build a Tree from given options
   * @param opts options to apply
   * @param data additional parameters
   * @returns resulting tree
   */
  buildTree(opts: TreeBuilderConfig, ...data: any[]): Tree<E>;
}
