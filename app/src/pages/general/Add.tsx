import React from "react"
import { useHistory } from "react-router"
import Button from "../../components/Button"
import { appState } from "../../data/AppState"
import { useGuard } from "../../data/useGuard"
import PlainLayout from "../../layouts/PlainLayout"

function Invite() {
	useGuard()

	const history = useHistory()

	return (
		<PlainLayout
			footer={
				<Button fill="outline" expand="block" onClick={() => history.goBack()}>
					Done
				</Button>
			}
		>
			<h1 className="center">Add someone to your family</h1>
			<p className="center">
				To add someone, open the Steward app or the website and click {"'"}Join Family{"'"}.
				<br />
				Then, enter the code below.
			</p>
			<div className="monospace huge">{appState.familyCode}</div>
		</PlainLayout>
	)
}

export default Invite
