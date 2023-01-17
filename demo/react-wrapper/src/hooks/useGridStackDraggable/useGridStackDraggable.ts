import { usePrevious } from 'react-use';
import { useCallback, useEffect, useRef } from 'react';
import { DDElement } from 'gridstack/dist/dd-element';
import { DDGridStack } from 'gridstack/dist/dd-gridstack';
import shallowEqual from 'shallowequal';

import { gridStackAttributes } from '../../constants';
import { UseGridStackAttribute, UseGridStackDraggableOptions } from './types';

const dd = new DDGridStack();
/** Creates Drag-and-Droppable from outside item for GridStack
 *
 * @param
 *
 * Required props
 * w - width of the droppable item
 * h - height of the droppable item
 *
 * @example
 * const gridItemRef = useGridStackDraggable({ w: 2, h: 2 });
 *<div ref={gridItemRef}>Draggable Item</div>
 */
const useGridStackDraggable = (options: UseGridStackDraggableOptions) => {
	const gridStackItemRef = useRef<HTMLElement | null>(null);
	const prevOptions = usePrevious(options);

	useEffect(() => {
		if (
			gridStackItemRef.current === null ||
			shallowEqual(options, prevOptions)
		) {
			return;
		}
		const {
			appendTo = 'body',
			helper = 'clone',
			handle = 'grid-stack-item-content',
			start,
			stop,
			drag,
			...attributeOptions
		} = options;

		/* Initializes as GridStack draggable element */
		if (!dd.isDraggable(gridStackItemRef.current)) {
			const ddElement = DDElement.init(gridStackItemRef.current);

			ddElement.setupDraggable({
				appendTo,
				helper,
				handle,
				start,
				stop,
				drag,
			});
		}

		/* Sets necessary attributes for gridStack */
		const optionEntries = Object.entries(attributeOptions);
		optionEntries.forEach(([key, value]) => {
			const gridStackAttribute = gridStackAttributes[key as keyof UseGridStackAttribute];
			if (typeof gridStackAttribute === 'string') {
				gridStackItemRef.current?.setAttribute(
					gridStackAttribute,
					String(value),
				);
			}
		});
	}, [options, prevOptions]);

	return useCallback((element: HTMLElement | null) => {
		gridStackItemRef.current = element;
	}, []);
};

export default useGridStackDraggable;