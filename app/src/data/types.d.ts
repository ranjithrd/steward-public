interface Family {
	_id?: string
	active?: boolean
	currency?: string
	users: User[]
	chores: Chore[]
	items: Item[]
	bills: Bill[]
}

interface User {
	_id: string
	name: string
	email: string
	device_id: string
}

interface Chore {
	_id: string
	name: string
	completed: boolean
	next_due: string
	repeats: boolean
	frequency?: number
}

interface Item {
	_id: string
	name: string
	image?: string
	buy_from?: string
	tag: string
	supplied: number
	last_checked: string
}

interface PItem extends Item {
	next_check: string
	supply_left: number
}

interface Bill {
	_id: string
	name: string
	tag: string
	repeats: boolean
	frequency?: string
	payments: { date: string; amount: string }[]
}

interface PBill extends Bill {
	last_paid?: string
	next_pay?: string
}
