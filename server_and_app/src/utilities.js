export function move(array, oldIndex, newIndex) {
    let invalidOldIndex = oldIndex < 0 || oldIndex >= array.length;
    let invalidNewIndex = newIndex < 0 || newIndex >= array.length;

    if(invalidOldIndex || invalidNewIndex) {
        return undefined;
    }

    let newArray = array.slice();
    let elementToMove = newArray.splice(oldIndex, 1)[0];
    newArray.splice(newIndex, 0, elementToMove);

    return newArray;
}
