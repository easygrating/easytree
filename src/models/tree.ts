import { sortBy } from "lodash";
import { TreeId } from "../types/tree.type";

/**
 * Utility class for tree-structured data models.
 */
export class Tree<T> {
  private _parent: Tree<T> | null = null;

  constructor(
    private _id: TreeId,
    private _data: T,
    private _children: Tree<T>[] = []
  ) {}

  public get id(): TreeId {
    return this._id;
  }

  public get data(): T {
    return this._data;
  }

  public set parent(parent: Tree<T> | null) {
    this._parent = parent;
  }

  public get parent(): Tree<T> | null {
    return this._parent;
  }

  /**
   * Adds a child node to the tree, and sets this tree as the parent of the child.
   * If the child is already in the tree, returns false, otherwise true.
   * @param child child instance to add
   * @returns {boolean}
   */
  addChild(child: Tree<T>): boolean {
    const exists = this.findNode(child.id);
    if (!!exists) return false;
    child.parent = this;
    return !!this._children.push(child);
  }

  /**
   * Adds a child node to the target node.
   * If the child is already in the tree or the parent is null, returns false, otherwise true.
   * @param child child instance to add
   * @param id node id to add the child
   * @returns {boolean}
   */
  addChildAt(child: Tree<T>, id: TreeId): boolean {
    const target = this.findNode(id);
    if (!target) return false;
    return target.addChild(child);
  }

  /**
   * Removes the child from the tree, and sets the parent to null.
   * @param id id of the child to remove
   * @returns {void}
   */
  removeChild(id: TreeId): void {
    const child = this.findNode(id);
    if (!child) return;
    child.parent = null;
    this._children = this._children.filter((child) => child.id !== id);
  }

  /**
   * Returns a tree's child by performing a deep search using the child's id.
   * @param {TreeId } id
   * @returns { Tree<T> | null }
   */
  findNode(id: TreeId): Tree<T> | null {
    if (this._id === id) return this;
    for (const child of this._children) {
      const found = child.findNode(id);
      if (!!found) return found;
    }
    return null;
  }

  /**
   * Returns the tree nodes in a list structure.
   * @param keys Keys | attributes of the resulting list object.
   * @param sortFunction An optional sorting function
   * @returns {unknown[]}
   */
  toList(keys?: string[], sortFunction?: Function): unknown[] {
    let data = {};
    if (!!keys) {
      keys.forEach((key) => {
        if (this._data.hasOwnProperty(key)) data[key] = this._data[key];
      });
    } else {
      data = Object.assign({}, this._data);
    }
    const list = [data];
    if (!!sortFunction) {
      this._children = sortBy(this._children, (child: Tree<T>) =>
        sortFunction(child)
      );
      this._children.forEach((child: Tree<T>) =>
        list.push(...child.toList(keys, sortFunction))
      );
    } else {
      this._children.forEach((child: Tree<T>) =>
        list.push(...child.toList(keys))
      );
    }
    return list;
  }

  /**
   * Returns a list with all ids of the tree in depth, from the current root to its last child.
   * @returns {(TreeId)[]}
   */
  toListId(): TreeId[] {
    const list = [this._id];
    this._children.forEach((child: Tree<T>) => list.push(...child.toListId()));
    return list;
  }

  /**
   * Returns a list of all children's data (the root is not included).
   * @param {string} keys the attributes of the node's data that you want to include in the response list
   * @returns {unknown[]} the list of child nodes (with all attributes or only those specified on keys param)
   */
  getChildList(keys?: string[]): unknown[] {
    return this._children.map((child) => {
      let data = {};
      if (!!keys) {
        keys.forEach((item) => {
          if (child.data.hasOwnProperty(item)) data[item] = child.data[item];
        });
      } else {
        data = child.data;
      }
      return data;
    });
  }

  /**
   * Create a JSON object from tree data and an [optionsChildren] array for
   * storing children nodes
   * @param optionsChildren children property name
   * @returns
   */
  toJSON<E = unknown>(optionsChildren: string): E {
    const plainTree = {
      ...this.data,
    };
    if (this._children.length) {
      plainTree[optionsChildren] = [];
      for (const child of this._children)
        plainTree[optionsChildren].push(child.toJSON(optionsChildren));
    }

    return plainTree as unknown as E;
  }
}
