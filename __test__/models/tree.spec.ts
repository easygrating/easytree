import { Tree } from "../../src/models/tree";
import { TreeId } from "../../src/types/tree.type";

describe("Test Tree", () => {
  let tree: Tree<unknown>;
  let child1: Tree<unknown>;

  beforeEach(() => {
    tree = new Tree(1, { prop1: "foo", prop2: "bar" });
    child1 = new Tree(2, { prop1: "foo", prop2: "bar" }, []);
    tree.addChild(child1);
  });

  test("can be created", () => {
    expect(tree).not.toBeNull();
  });

  test("has an id that can be retrieved", () => {
    expect(tree.id).toBe(1);
  });

  test("has data that can be retrieved", () => {
    expect(tree.data).not.toBeNull();
  });

  test("has no parent", () => {
    expect(tree.parent).toBeNull();
  });

  test("a child can be added", () => {
    expect(child1.parent).not.toBeNull();
    expect(child1.parent?.id).toEqual(1);
  });

  test("a child cannot be added twice", () => {
    tree.addChild(child1);
    const result = tree.toListId();
    expect(result.length).toBe(2);
  });

  test("a child can be found", () => {
    const found = tree.findNode(2);
    const notExists = tree.findNode(0);
    expect(found?.id).toEqual(2);
    expect(notExists).toBeNull();
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

  test("a child can be removed", () => {
    tree.removeChild(2);
    const ids = tree.toListId();
    expect(ids.length).toBe(1);
    expect(child1).not.toBeNull();
    expect(child1.parent).toBeNull();
  });

  test("a child cannot be removed if it does not exist", () => {
    tree.removeChild(2);
    const ids = tree.toListId();
    expect(ids.length).toBe(1);
    expect(child1).not.toBeNull();
  });

  test("must add a child to a custom node", () => {
    const data = { prop1: "fourth", prop2: "4" };
    const success = tree.addChildAt(new Tree(4, data), 2);
    const newborn = tree.findNode(4);
    expect(success).toBe(true);
    expect(newborn).not.toBeNull();
    expect(newborn?.id).toBe(4);
    expect(newborn?.data).toEqual({ prop1: "fourth", prop2: "4" });
  });

  test("a child cannot be added if target node doesnt exists", () => {
    const data = { prop1: "fourth", prop2: "4" };
    const success = tree.addChildAt(new Tree(4, data), 6);
    const newborn = tree.findNode(4);
    expect(success).toBe(false);
    expect(newborn).toBeNull();
  });

  test("must export a correct json", () => {
    tree.addChild(new Tree(3, { prop1: "third", prop2: "3" }));
    child1.addChild(new Tree(4, { prop1: "fourth", prop2: "4" }));
    const json = tree.toJSON("children");
    expect(json).toEqual({
      prop1: "foo",
      prop2: "bar",
      children: [
        {
          prop1: "foo",
          prop2: "bar",
          children: [
            {
              prop1: "fourth",
              prop2: "4",
            },
          ],
        },
        {
          prop1: "third",
          prop2: "3",
        },
      ],
    });
  });
});
