# easytree

Easytree is a TypeScript library designed to simplify the work with objects in tree data structures.

# Installation

You can install EasyTree via npm:

```bash
npm install @easygrating/easytree
```

# Features

- Build a `Tree<T>` data structure using user's defined options (define by library interfaces).
- Provide a `Tree<T>` class with several utility methods to work with a tree data structure.
- Transform an array of objects into a tree data structure.
- Returns the tree's data in a JSON object format.

## Creating the Tree 🌳

- `buildTree(opts: TreeBuilderConfig, data: E[]): Tree<E>`: takes an options configuration object and an array of objects and returns a `Tree<T>` data structure

## Using the Tree 🌳

```typescript
// Import required functions
import { ListTreeBuilder, TreeBuilderConfig, Tree }  from '@easygrating/easytree';

function useTree(){
  const list = [
     { id: 1, name: "first" },
     { id: 2, name: "second", email: "second@gmail.com", fk: 3 },
     { id: 3, name: "third", email: "third@gmail.com", fk: 1 },
     { id: 4, name: "fourth", email: "fourth@gmail.com", fk: 1 },
     { id: 5, name: "fifth", email: "fifth@gmail.com", fk: 4 },
     { id: 6, name: "sixth", email: "sixth@gmail.com", fk: 4 },
   ];
  const treeBuilder = new ListTreeBuilder();
   // Create the options config object. fk is the "foreign key" or "parent key" of that object.
   const treeConfigOption: TreeBuilderConfig = { fk: "fk" };
   const tree = treeBuilder.buildTree(treeConfigOption, list);

   // Get the size of the tree (amount of nodes)
   const treeSize = tree.size; // 6

  // Find a child node in the tree by the id
  const fifthChild = tree.findNode(5); // { id: 5, name: "fifth", fk: 4 }

  // Get the level of a node in the tree
  const fifthChildLevel = fifthChild.level; // 2

  // Add a new node to the tree
  const newChild = new Tree(7, { id: 7, name: "seventh", email: "seventh@gmail.com" }, []);
  fifthChild.addChild(newChild);

  // Returns the list of childs whit the attributes passed on the keys params
  fifthChild.getChildList(['id', 'email']); // [{ id: 7, email: "seventh@gmail.com" }]

  // Remove a node from the tree
  tree.removeChild(6);

  // Returns the list of ids of the tree nodes
  tree.getListId(); // [1, 2, 3, 4, 5, 7]

   // Add a new node to the tree as child of an existing node by id 
  const newChildOfSeventh = new Tree(8, { id: 8, name: "eighth", email: "eighth@gmail.com" }, []);
  tree.addChildAt(newChildOfSeventh, 7);

  // Returns a JSON object with the tree data
  const inJSON = tree.toJSON();

}
```

# License
This project is licensed under the MIT License.

# Keywords
`tree`, `util`, `list`, `data structure`