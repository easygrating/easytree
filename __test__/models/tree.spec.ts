import { Tree } from "../../src/models/tree";

describe('Test Tree', () => {
    const tree = new Tree(1, { prop: 'foo' }, []);
    test('can be created', () => {
        expect(tree).not.toBeNull();
    });
    test('has an id', () => {
        expect(tree.id).toBe(1);
    });
    test('has no parent', () => {
        expect(tree.parent).toBeNull();
    });
})