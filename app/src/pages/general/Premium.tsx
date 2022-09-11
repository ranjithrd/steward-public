import { useIonAlert } from "@ionic/react"
import React from "react"
import { useHistory } from "react-router-dom"
import Button from "../../components/Button"
import { appState } from "../../data/AppState"
import PlainLayout from "../../layouts/PlainLayout"
import { PremiumModule } from "./PremiumModule"
import { Create } from "../../data/Create"

function Premium() {
	const [presentAlert] = useIonAlert()
	const history = useHistory()

	function handleBuy() {
		PremiumModule.purchase(presentAlert, async (receipt) => {
			await Create.createFamily(true, receipt).catch((e) => presentAlert(e))
			history.replace("/thanks")
		})
	}

	async function handleCreate() {
		if (appState.hasFamily) {
			history.replace("/home")
		} else {
			await Create.createFamily(false).catch((e) => presentAlert(e))
			history.replace("/details")
		}
	}

	return (
		<PlainLayout
			footer={
				<>
					<Button fill="outlined" expand="full" onClick={handleCreate}>
						Continue without Premium
					</Button>
					<div className="half-spacer"></div>
					<Button expand="full" onClick={handleBuy}>
						{appState.hasFamily ? "Upgrade to Premium" : "Buy Premium"}
					</Button>
				</>
			}
		>
			<div className="column-align">
				<h1>Steward Premium</h1>
				<p>
					With Premium, you'll be able to invite family and use the app together with them. Premium costs $3
					once and you'll be able to use it for a lifetime.
					{/* TODO COST */}
				</p>
				<div className="spacer-small"></div>
				<div className="monospace huge">$3</div>
				<p>One time.</p>
				<div className="spacer"></div>
				<hr className="hr" />
				<p className="small disabled">ALTERNATIVELY</p>
				<h4>Free</h4>
				<p>
					The free plan allows only this device to use Steward. While you won't be able to invite other users,
					you'll still be able to use all features.
				</p>
			</div>
			{/* <Slider
				slides={[
					<div className="column">
						<h1 className="center">Invite friends and family with Steward Premium.</h1>
						<p className="center">Track items.</p>
					</div>,
				]}
			/> */}
		</PlainLayout>
	)
}

export default Premium
