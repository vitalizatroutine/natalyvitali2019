/**
 * Return a className string based on array of conditions and results
 * @param array.condition
 * @param array.trueClassName
 * @param array.falseClassName
 * @returns {*}
 */
export const getClassName = (baseClassName, array) => {
    let className = baseClassName || '';

    (array || []).forEach((classItem) => {
        if (classItem.condition && classItem.trueClassName) {
            className += ` ${classItem.trueClassName}`;
        }

        if (!classItem.condition && classItem.falseClassName) {
            className += ` ${classItem.falseClassName}`;
        }
    });

    return className;
};