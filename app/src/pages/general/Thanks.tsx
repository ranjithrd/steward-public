import React from "react"
import { Link } from "react-router-dom"
import Button from "../../components/Button"
import { appState } from "../../data/AppState"
import PlainLayout from "../../layouts/PlainLayout"

function Thanks() {
	return (
		<PlainLayout
			footer={
				<Link to={appState.hasFamily === true ? "/home" : "/details"}>
					<Button expand="block">Continue</Button>
				</Link>
			}
		>
			<div className="column-align">
				<h1>Thank you for purchasing Premium!</h1>
				<p>We are grateful for your support.</p>
				<p>
					As we'd mentioned, with Premium, you'll be able to add as many members as you'd like to your family.
				</p>
				<p>
					In addition, all data that's stored on our servers is 100% encrypted, and even we cannot see what
					your plans are.
				</p>
			</div>
		</PlainLayout>
	)
}

export default Thanks
