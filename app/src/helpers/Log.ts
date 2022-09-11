export function appLog(item: any) {
	console.log("\x1b[33m%s\x1b[0m", item)
}

export function debugLog(item: any) {
	console.log("\x1b[36m%s\x1b[0m", item)
}

export function error(item: any) {
	console.log("\x1b[31m%s\x1b[0m", item)
}
