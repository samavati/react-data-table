class Node {
    constructor(value, key) {
        this.key = key;
        this.value = [value];
        this.left = null;
        this.right = null;
    }
}
export class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value, key) {
        const newNode = new Node(value, key);
        if (this.root === null) {
            this.root = newNode;
        } else {
            let current = this.root;
            while (true) {
                if (key < current.key) {
                    if (current.left === null) {
                        current.left = newNode;
                        return;
                    } else {
                        current = current.left;
                    }
                } else if (key > current.key) {
                    if (current.right === null) {
                        current.right = newNode;
                        return;
                    } else {
                        current = current.right;
                    }
                } else {
                    current.value.push(value);
                    return;
                }
            }
        }
    }

    find(key) {
        let current = this.root;
        while (current) {
            if (key < current.key) {
                current = current.left;
            } else if (key > current.key) {
                current = current.right;
            } else {
                return current.value;
            }
        }
        return -1;
    }
}