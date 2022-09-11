import { appState } from "./AppState"
import { useEffect } from "react"
import { useHistory } from "react-router"

export function useGuard() {
	const history = useHistory()

	useEffect(() => {
		if (appState.key === "" || !appState.hasFamily) {
			history.replace("/welcome")
		}
	}, [])
}
