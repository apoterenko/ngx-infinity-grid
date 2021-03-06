import {Component} from '@angular/core';

import {
	InfinityPage,
	InfinityPageData,
} from "ng2-infinity-grid/index";

@Component({
	moduleId: module.id,
	selector: 'sd-home',
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.css'],
})
export class HomeComponent {

	private dataProvider: DataProvider;
	private pageData: InfinityPageData<string>;

	constructor() {
		this.dataProvider = new DataProvider();  // Inject your data provider here
	}

	private clearData() {
		// Case #1 - initial state
		// Flux action should be started here. Local pageData object should be updated during Flux-lifecycle
		this.pageData = null;
	}

	private loadData() {
		// Case #2
		// Flux action should be started here. Local pageData object should be updated during Flux-lifecycle
		this.pageData = {};
	}

	private onFetchPage(page: InfinityPage) {
		// Case #3
		// Flux action should be started here. Local pageData object should be updated during Flux-lifecycle
		// When long asynchronous request has been started so we should show loading rows in grid
		this.pageData = {
			startIndex: page.startIndex,
			endIndex: page.endIndex
		};

		if (!page.isReady) {
			this.dataProvider.fetch(page)
				.then((pageData: InfinityPageData<string>) => {
					if (pageData.startIndex === this.pageData.startIndex) {

						// Case #4
						// The promise is not cancellable [https://github.com/tc39/proposal-cancelable-promises]
						// We should check the current index
						this.pageData = pageData;
					}
				});
		}
	}
}

class DataProvider {

	private buffer: string[] = [];

	constructor() {
		for (let i = 0; i < 1000000; i++) {
			this.buffer[i] = 'test-' + i;
		}
	}

	public fetch(page: InfinityPage): Promise<InfinityPageData<string>> {
		return new Promise<InfinityPageData<string>>((resolve) => {
			setTimeout(() => {
				resolve({
					startIndex: page.startIndex,
					rawData: this.buffer.slice(page.startIndex, page.endIndex + 1),
					totalLength: this.buffer.length
				});
			}, 1000);
		});
	}
}
