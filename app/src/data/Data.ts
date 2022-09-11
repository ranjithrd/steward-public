import { proxy, useSnapshot } from "valtio"

export const emptyFamily: Family = {
	_id: "",
	active: false,
	users: [],
	chores: [],
	items: [],
	bills: [],
}

export const state = proxy({
	familyData: emptyFamily,
	loaded: false,
})

export const useData = () => {
	return useSnapshot(state)
}
