import { IonInput, IonSpinner, useIonAlert, useIonToast } from "@ionic/react"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import Button from "../../components/Button"
import { appState } from "../../data/AppState"
import { http } from "../../data/http"
import { Sync } from "../../data/Sync"
import PlainLayout from "../../layouts/PlainLayout"
import { KeyModule } from "./KeyModule"

function Join() {
	const history = useHistory()
	const [presentAlert] = useIonAlert()
	const [presentToast] = useIonToast()
	const [code, setCode] = useState<number | undefined>()
	const [error, setError] = useState<string | null>(null)
	const [sent, setSent] = useState(false)

	async function handleNext() {
		const safeCode = code ?? 0
		if (safeCode > 99999 || safeCode < 9999) {
			setError("Please enter a valid code.")
		} else {
			setError(null)
			setSent(true)
		}
	}

	useEffect(() => {
		if (!sent) return
		const int = setInterval(async () => {
			console.log("interval")
			console.log(sent)
			if (sent) {
				const res = await http.get(`/device/info/${appState.deviceId}`).catch((e) => console.log(e))
				if (!res) return
				const data = res!.data
				if (data.confirmation.familyId === "not approved") {
					presentAlert("You've been denied entry.", [
						{
							text: "Ok",
							handler: () => {
								history.replace("/welcome")
							},
						},
					])
					return
				} else if (data.confirmation.familyId === "null") {
					return
				} else {
					console.log(data)
					appState.familyCode = data.confirmation.familyCode
					appState.familyId = data.confirmation.familyId
					appState.hasPaid = true
					appState.hasFamily = true
					appState.token = data.token
					await KeyModule.enterFamily(data.confirmation.familyKey)
					console.log(appState)
					presentToast("Entry allowed!", 2000)
					Sync.syncRemote()
					history.replace("/introduction")
				}
			}
		}, 10 * 1000)
		return () => {
			clearInterval(int)
		}
	}, [sent])

	useEffect(() => {
		if (sent) {
			KeyModule.startShare(presentAlert, presentToast, code ?? 0).catch((e) => setError(e))
		}
	}, [sent])

	console.log(sent)

	return (
		<PlainLayout
			header={
				<button className="danger" onClick={() => history.goBack()}>
					Back
				</button>
			}
			footer={
				sent ? null : (
					<Button expand="block" onClick={handleNext}>
						Join
					</Button>
				)
			}
		>
			{sent ? (
				<>
					<p>We{"'"}ve sent the invite, please accept it on a device already signed in to Steward.</p>
					<p className="grayed small">Note that it may take up to a minute.</p>
					<div className="center">
						<IonSpinner name="lines-small" />
					</div>
				</>
			) : (
				<>
					<h1 className="center">Enter the family</h1>
					<p className="center">
						Ask someone in your family to <i>open up the menu</i> by clicking the button in the top left and
						opening <i>Invite</i>.
					</p>
					<div>
						<IonInput
							value={code}
							onIonChange={(e) => setCode(parseInt(e.detail.value ?? "0"))}
							type="number"
							className="input outline monospace huge"
						/>
						<div className="spacer"></div>
						<p className="red">{error}</p>
					</div>
				</>
			)}
		</PlainLayout>
	)
}

export default Join
