import { appState } from "./../../data/AppState"
import moment from "moment"

export class ItemsModule {
	static getTags(): string[] {
		// TODO default tags
		const defaultTags = ["Vegetables", "Fruits", "Toiletries", "Snacks"]
		const savedTags = appState.savedTags
		return [...defaultTags, ...savedTags]
	}

	static processItems(items: Item[]): PItem[] {
		return items
			.slice()
			.sort((a, b) => moment(a.last_checked).valueOf() - moment(b.last_checked).valueOf())
			.map((e) => ({
				...e,
				next_check: moment(e.last_checked).add({ days: e.supplied }).toISOString(),
			}))
			.map((e) => ({
				...e,
				supply_left: moment.duration(moment(e.next_check).diff(moment())).get("days"),
			}))
	}
	static returnItem(item: PItem): Item {
		return {
			_id: item._id,
			name: item.name,
			image: item.image,
			tag: item.tag,
			last_checked: item.last_checked,
			supplied: item.supplied,
		}
	}
}
