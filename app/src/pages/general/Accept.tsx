import { IonSpinner, useIonAlert } from "@ionic/react"
import React, { useEffect, useState } from "react"
import Button from "../../components/Button"
import Card from "../../components/Card"
import { http } from "../../data/http"
import { useGuard } from "../../data/useGuard"
import BaseLayout from "../../layouts/BaseLayout"
import { KeyModule } from "./KeyModule"

function Accept(props: { deviceId: string; reset: () => void }) {
	useGuard()

	const device_id = props.deviceId ?? ""
	const [data, setData] = useState<any | null>(null)
	const [alert] = useIonAlert()

	useEffect(() => {
		http.get(`/device/info/${device_id}`).then((d) => setData(d.data))
	}, [])

	if (!data) {
		return <IonSpinner name="crescent" />
	}

	const deviceData = data.deviceDetails

	async function handleAccept() {
		await KeyModule.approveShare(device_id, data.publicKey, (e) => alert(e))
		props.reset()
	}
	async function handleDeny() {
		await KeyModule.denyShare(device_id)
		props.reset()
	}

	return (
		<BaseLayout title="Accept" child={true} tab="home">
			<div className="spacer"></div>
			<h1>Add this device to your family</h1>
			<div className="spacer"></div>
			<Card hideRipple={true}>
				<h4>Device Details</h4>
				<p>
					<strong>Platform</strong> {deviceData.os}
				</p>
				<p>
					<strong>Manufactured by</strong> {deviceData.manufacturer ?? "Unknown"}
				</p>
				<p>
					<strong>Name</strong> {deviceData.name}
				</p>
			</Card>
			<Button expand="block" onClick={handleAccept}>
				Accept
			</Button>
			<Button fill="outlined" expand="block" onClick={handleDeny}>
				Deny
			</Button>
		</BaseLayout>
	)
}

export default Accept
