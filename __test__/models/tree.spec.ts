import { Tree } from "../../src/models/tree";
import { TreeId } from "../../src/types/tree.type";

describe('Test Tree', () => {
    const tree = new Tree(1, { prop1: 'foo', prop2: 'bar' }, []);

    test('can be created', () => {
        expect(tree).not.toBeNull();
    });

    test('has an id that can be retrieved', () => {
        expect(tree.id).toBe(1);
    });

    test('has data that can be retrieved', () => {
        expect(tree.data).not.toBeNull();
    });

    test('has no parent', () => {
        expect(tree.parent).toBeNull();
    });

    const child1 = new Tree(2, { prop1: 'foo', prop2: 'bar' }, []);
    tree.addChild(child1);
    test('a child can be added', () => {
        expect(child1.parent).not.toBeNull();
        expect(child1.parent.id).toEqual(1);
    });

    test('a child can be found', () => {
        const found = tree.findChild(2);
        const notExists = tree.findChild(0);
        expect(found.id).toEqual(2);
        expect(notExists).toBeNull();
    });

    test('a list of the ids can be obtained', () => {
        const ids = tree.toListId();
        expect(ids).toBeInstanceOf(Array<TreeId>);
    })

    test('a list of the tree leaf nodes can be obtained', () => {
        const list = tree.toList();
        expect(list).toBeInstanceOf(Array);
    })

    test('a list of the tree nodes can be obtained with specific props', () => {
        const list = tree.toList(['prop1']);
        expect(list).toBeInstanceOf(Array);
        list.forEach(item => { 
            expect(item).toHaveProperty('prop1');
            expect(item).not.toHaveProperty('prop2');
        });        
    })

    test('a sorting function can be passed to the list method', () => {        
        const list = tree.toList(['prop1'], (it) => {
            return it.id
        });
        expect(list).toBeInstanceOf(Array);
        list.forEach(item => { 
            expect(item).toHaveProperty('prop1');
        }); 
    })

    test('a child can be removed', () => {
        tree.removeChild(2);
        const ids = tree.toListId();
        expect(ids).toBeInstanceOf(Array);
        expect(ids).not.toContain(2);
        expect(child1.parent).toBeNull();
    })
})