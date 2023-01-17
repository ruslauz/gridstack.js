import { ReactNode } from "react";
import { UseGridStackDraggableOptions } from "../../hooks/useGridStackDraggable/types";

export type GridStackDraggableProps = {
    className?: string;
    contentClassName?: string;
    children?: ReactNode;
} & UseGridStackDraggableOptions;
