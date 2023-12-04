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

## Creating the Tree 🌳

- `buildTree(opts: TreeBuilderConfig, data: E[]): Tree<E>`: takes an options configuration object and an array of objects and returns a `Tree<T>` data structure

## Using the Tree 🌳

```typescript
// Import required functions
import { ListTreeBuilder, TreeBuilderConfig }  from '@easygrating/easytree';

function useTree(){
  const list = [
     { id: 1, name: "first" },
     { id: 2, name: "second", email: "second@gmail.com", fk: 3 },
     { id: 3, name: "third", email: "third@gmail.com", fk: 1 },
     { id: 4, name: "four", email: "four@gmail.com", fk: 1 },
     { id: 5, name: "five", email: "five@gmail.com", fk: 4 },
     { id: 6, name: "six", email: "six@gmail.com", fk: 4 },
   ];
  const treeBuilder = new ListTreeBuilder();
   // Create the options config object. fk is the "Father key" of that object.
   const treeConfigOption: TreeBuilderConfig = { fk: "fk" };
   const tree = treeBuilder.buildTree(treeConfigOption, list);

  // Find a child node  in the tree by the id
  const fithChild = tree.findChild(5) // return { id: 5, name: "five", fk: 4 }

  // Add a new node to the tree
  const newChild = new Tree(7, { id: 7, name: "seven", email: "seven@gmail.com" }, []);
  fithChild.addChild(newChild);

  // Returns the list of childs whit the attributes passed on the keys params
  fithChild.getChildList(['id', 'email']); // return [{ id: 7, email: "seven@gmail.com" }]

  // Remove a node from the tree
  tree.remove(6);

  // Returns the list of ids of the tree nodes
  tree.getListId(); // return [1, 2, 3, 4, 5, 7]

}
```

# License
This project is licensed under the MIT License.

# Keywords
`tree`, `util`, `list`