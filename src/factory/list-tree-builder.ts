import { Tree } from "../models/tree";
import { TreeBuilderConfig, TreeBuilderInterface } from "../models/tree-builder";
import { chain } from "lodash";
/**
 * Converts a list into a tree
 */
export class ListTreeBuilder<E = unknown> implements TreeBuilderInterface<E> {
  /**
   * @param opts options to apply
   * @param data tree source data
   * @returns resulting tree
   */
  buildTree(opts: TreeBuilderConfig, data: E[]): Tree<E> {
    const idKey = opts.pk || "id";
    if (!opts.fk || "string" !== typeof opts.fk) {
      throw new Error("foreign (opts.fk) key must be provided");
    }
    let root: Tree<E>;
    const list = chain(data)
      .map((item) => new Tree(item[idKey], item))
      .value();
    const idGroup = chain(list)
      .groupBy(idKey)
      .mapValues((item) => item[0])
      .value();
    list.forEach((item) => {
      if (item.data[opts.fk]) {
        idGroup[item.data[opts.fk]].addChild(item);
      } else {
        root = item;
      }
    });
    return root;
  }
}
