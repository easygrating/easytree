import { ListTreeBuilder } from "../../src/factory/list-tree-builder";

/**
 *
 *      ----1----
 *      |       |
 *   ---3    ---4----
 *  |        |      |
 *  2        5      6
 *
 *
 */
describe("Test tree factory", () => {
  const list = [
    { id: 1, name: "first" },
    { id: 2, name: "second", fk: 3 },
    { id: 3, name: "third", fk: 1 },
    { id: 4, name: "four", fk: 1 },
    { id: 5, name: "five", fk: 4 },
    { id: 6, name: "six", fk: 4 },
  ];

  const treeBuilder = new ListTreeBuilder();

  test("tree must not be null", () => {
    const tree = treeBuilder.buildTree({ fk: "fk" }, list);
    expect(tree).not.toBeNull();
  });

  test("tree root is correct", () => {
    const tree = treeBuilder.buildTree({ fk: "fk" }, list);
    expect(tree.id).toBe(1);
  });

  test("it must throw an error if no fk is provided", () => {
    expect(() => treeBuilder.buildTree({ fk: undefined }, list)).toThrow();
  });

  test("first level children length must be 2", () => {
    const tree = treeBuilder.buildTree({ fk: "fk" }, list);
    const children = tree.getChildList();
    expect(children).toHaveLength(2);
  });

  test("first level children must be 3 and 4", () => {
    const tree = treeBuilder.buildTree({ fk: "fk" }, list);
    const children = tree.getChildList(["id"]);
    expect(children).toContainEqual({ id: 3 });
    expect(children).toContainEqual({ id: 4 });
  });

  test("2 is 3's child ", () => {
    const tree = treeBuilder.buildTree({ fk: "fk" }, list);
    const node = tree.findChild(2);
    expect(node.parent.id).toEqual(3);
  });

  test("2 is leaf ", () => {
    const tree = treeBuilder.buildTree({ fk: "fk" }, list);
    const node = tree.findChild(2);
    expect(node.getChildList()).toHaveLength(0);
  });
});
