import { Tree } from "../../src/models/tree";
import { TreeId } from "../../src/types/tree.type";

describe("Test Tree", () => {
  let tree: Tree<unknown>;
  let child1: Tree<unknown>;
  let child2: Tree<unknown>;
  let child3: Tree<unknown>;
  let child4: Tree<unknown>;

  beforeEach(() => {
    tree = new Tree(0, { prop1: "foo", prop2: "bar" });
    child1 = new Tree(1, { prop1: "first", prop2: "bar" });
    child2 = new Tree(2, { prop1: "second", prop2: "2" });
    child3 = new Tree(3, { prop1: "third", prop2: "3" });
    child4 = new Tree(4, { prop1: "fourth", prop2: "4" });
  });

  test("can be created", () => {
    expect(tree).not.toBeNull();
  });

  test("has an id that can be retrieved", () => {
    expect(tree.id).toBe(0);
  });

  test("has data that can be retrieved", () => {
    expect(tree.data).not.toBeNull();
  });

  test("has no parent", () => {
    expect(tree.parent).toBeNull();
  });

  test("a child can be added", () => {
    tree.addChild(child1);
    expect(child1.parent).not.toBeNull();
    expect(child1.parent?.id).toEqual(0);
    expect(tree.children.length).toEqual(1);
  });

  test("a child cannot be added twice", () => {
    tree.addChild(child1);
    tree.addChild(child1);
    expect(tree.children.length).toEqual(1);
  });

  test("a child can be found", () => {
    tree.addChild(child1);
    tree.addChild(child2);
    const found = tree.findNode(2);
    const notExists = tree.findNode(-1);
    expect(found?.id).toEqual(2);
    expect(notExists).toBeNull();
  });

  test("must add a child to a custom node", () => {
    tree.addChild(child1);
    tree.addChild(child2);
    child2.addChild(child3);
    const success = tree.addChildAt(child4, 3);
    const newborn = tree.findNode(4);
    expect(success).toBe(true);
    expect(newborn?.parent?.id).toEqual(3);
    expect(newborn?.data).toEqual({ prop1: "fourth", prop2: "4" });
  });

  test("a child cannot be added if target node doesnt exists", () => {
    tree.addChild(child1);
    tree.addChild(child2);
    child2.addChild(child3);
    const success = tree.addChildAt(child4, 6);
    const newborn = tree.findNode(4);
    expect(success).toBe(false);
    expect(newborn).toBeNull();
    expect(child4?.parent).toEqual(null);
  });

  test("a child can be removed", () => {
    tree.addChild(child1);
    tree.addChild(child2);
    tree.addChildAt(child3, 1);
    tree.removeChild(3);
    const ids = tree.toListId();
    expect(ids.length).toBe(3);
    expect(child3).not.toBeNull();
    expect(child3.parent).toBeNull();
  });

  test("a child cannot be removed if it does not exist", () => {
    tree.removeChild(2);
    const ids = tree.toListId();
    expect(ids.length).toBe(1);
    expect(child1).not.toBeNull();
  });

  test("a list of the ids can be obtained", () => {
    const ids = tree.toListId();
    expect(ids).toBeInstanceOf(Array<TreeId>);
  });

  test("a list of the tree leaf nodes can be obtained", () => {
    const list = tree.toList();
    expect(list).toBeInstanceOf(Array);
    list.forEach((item) => {
      expect(item).toHaveProperty("prop1");
      expect(item).toHaveProperty("prop2");
    });
  });

  test("a list of the tree nodes can be obtained with specific props", () => {
    const list = tree.toList(["prop1"]);
    expect(list).toBeInstanceOf(Array);
    list.forEach((item) => {
      expect(item).toHaveProperty("prop1");
      expect(item).not.toHaveProperty("prop2");
    });
  });

  test("a sorting function can be passed to the list method", () => {
    const list = tree.toList(["prop1"], (it) => {
      return it.id;
    });
    expect(list).toBeInstanceOf(Array);
    list.forEach((item) => {
      expect(item).toHaveProperty("prop1");
    });
  });

  test("a child list can be obtained", () => {
    const list = tree.getChildList();
    expect(list).toBeInstanceOf(Array);
    list.forEach((item) => {
      expect(item).toHaveProperty("prop1");
      expect(item).toHaveProperty("prop2");
    });
  });

  test("a child list can be obtained with specific props", () => {
    const list = tree.getChildList(["prop1"]);
    expect(list).toBeInstanceOf(Array);
    list.forEach((item) => {
      expect(item).toHaveProperty("prop1");
      expect(item).not.toHaveProperty("prop2");
    });
  });

  test("must export a correct json", () => {
    const child5 = new Tree(5, { prop1: "fifth", prop2: "5" });

    tree.addChild(child1);
    tree.addChild(child2);
    tree.addChildAt(child4, 2);
    tree.addChildAt(child3, 4);
    tree.addChildAt(child5, 1);
    const json = tree.toJSON("children");

    expect(json).toEqual({
      prop1: "foo",
      prop2: "bar",
      children: [
        {
          prop1: "first",
          prop2: "bar",
          children: [{ prop1: "fifth", prop2: "5" }],
        },
        {
          prop1: "second",
          prop2: "2",
          children: [
            {
              prop1: "fourth",
              prop2: "4",
              children: [
                {
                  prop1: "third",
                  prop2: "3",
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
