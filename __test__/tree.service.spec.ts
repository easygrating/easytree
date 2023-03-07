import { Tree } from "../src/models/tree";

describe('Test Tree', () => {
    test('Should not be null on create', () => {
        const tree = new Tree(1, {}, []);
        expect(tree.id).toEqual(1);
    });
})