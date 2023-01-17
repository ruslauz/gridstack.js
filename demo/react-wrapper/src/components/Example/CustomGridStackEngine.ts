import { GridStackEngine } from 'gridstack';

export default class CustomGridStackEngine extends GridStackEngine {

	/* Disables vertical swapping of items of the same height */
	swap() {
		return false;
	}
}
