import { sortBy } from 'lodash';
import { TreeId } from '../types/tree.type';

/**
 * Utility class for tree-structured data models.
 */
export class Tree<T> {

    private _parent: Tree<T> | null = null;

    constructor(
        private _id: TreeId,
        private _data: T,
        private _children: Tree<T>[] = []
    ) { }

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
     * If the child is already in the tree, returns null.
     * @param child child instance to add
     * @returns {void}
     */
    addChild(child: Tree<T>): void {
        const exists = this.findChild(child.id);
        if (!!exists) return;
        child.parent = this;
        this._children.push(child);
    }

    /**
     * Removes the child from the tree, and sets the parent to null.
     * @param id id of the child to remove
     * @returns {void}
     */
    removeChild(id: TreeId) {
        const child = this.findChild(id);
        if (!child) return;
        child.parent = null;
        this._children = this._children.filter(child => child['id'] !== id);
    }

    /**
     * Returns a tree's child by performing a deep search using the child's id. 
     * @param {TreeId } id 
     * @returns { Tree<T> | null }
     */
    findChild(id: TreeId): Tree<T> | null {
        if (this._id === id) return this;
        for (const child of this._children) {
            const found = child.findChild(id);
            if (!!found) return found;
        }
        return null;
    }

    /**
     * Returns the tree nodes in a list structure.
     * @param keys Keys | attributes of the resulting list object.
     * @param sortFunction An optional sorting function
     * @returns {{}[]}
     */
    toList(keys?: string[], sortFunction?: Function): {}[] {
        let data = {};
        if (!!keys) {
            keys.forEach(key => {
                if (this._data.hasOwnProperty(key))
                    data[key] = this._data[key];
            })
        } else {
            data = Object.assign({}, this._data);
        }
        const list = [data];
        if (!!sortFunction) {
            this._children = sortBy(this._children, (child: Tree<T>) => sortFunction(child));
            this._children.forEach((child: Tree<T>) => list.push(...child.toList(keys, sortFunction)));
        } else {
            this._children.forEach((child: Tree<T>) => list.push(...child.toList(keys)))
        }
        return list
    }

    /**
     * Returns a list with all ids of the tree in depth, from the current root to its last child.
     * @returns {(TreeId)[]}
     */
    toListId(): (TreeId)[] {
        const list = [this._id];
        this._children.forEach((child: Tree<T>) => list.push(...child.toListId()));
        return list;
    }

    /**
     * Returns a list of all children's data (the root is not included).
     * @param {string} keys 
     * @returns {{}[]}
     */
    getChildList(keys?: string[]) {
        return this._children.map(child => {
            let data = {}
            if (!!keys) {
                keys.forEach(item => {
                    if (child.data.hasOwnProperty(item))
                        data[item] = child.data[item]
                })
            } else {
                data = child.data
            }
            return data
        })
    }

}