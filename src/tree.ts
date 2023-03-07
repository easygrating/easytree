import { sortBy } from 'lodash';

/**
 * Utility class for tree-structured data models.
 */
export class Tree<T> {

    private _parent: Tree<T>;

    constructor(
        private _id: number | string,
        private _data: T,
        private _children: Tree<T>[]
    ) { }

    public get id(): number | string {
        return this._id;
    }

    public get data(): T {
        return this._data;
    }

    public set parent(parent: Tree<T>) {
        this._parent = parent;
    }

    public get parent(): Tree<T> {
        return this._parent;
    }

    addChild(child: Tree<T>) {
        child.parent = this;
        this._children.push(child);
    }

    removeChild(id: number | string) {
        this._children = this._children.filter(child => child['id'] !== id);
    }

    /**
     * Returns a tree's child by performing a deep search using the child's id. 
     * @param {number | string } id 
     * @returns { Tree<T> | null }
     */
    findChild(id: number | string): Tree<T> | null {
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
    toList(keys: string[], sortFunction?: Function): {}[] {
        let data = {};
        if (!!keys) {
            keys.forEach(key => {
                if (this.hasOwnProperty(key))
                    data[key] = this[key];
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
     * @returns {(number | string)[]}
     */
    toListId(): (number | string)[] {
        const list = [this._id];
        this._children.forEach((child: Tree<T>) => list.push(...child.toListId()));
        return list;
    }



}