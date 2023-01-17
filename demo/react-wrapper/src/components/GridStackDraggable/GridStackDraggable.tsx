import cn from 'classnames';

import useGridStackDraggable from '../../hooks/useGridStackDraggable';
import { GridStackDraggableProps } from './types';

export const GridStackDraggable = (props: GridStackDraggableProps) => {
	const {
		children,
		className,
		contentClassName,
		...useGridStackItemPops
	} = props

	const ref = useGridStackDraggable(useGridStackItemPops);

	return (
		<div ref={ref} className={cn('grid-stack-item', className)}>
			<div className={cn('grid-stack-item-content', contentClassName)}>
				{children}
			</div>
		</div>
	);
};

export default GridStackDraggable;
