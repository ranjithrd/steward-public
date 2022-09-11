import { Device } from "@capacitor/device"
import React, { useEffect, useState } from "react"
import Card from "src/components/Card"
import { http } from "src/data/http"
import { appState } from "../../data/AppState"
import { useGuard } from "../../data/useGuard"
import BaseLayout from "../../layouts/BaseLayout"

function Settings() {
	useGuard()

	const [data, setData] = useState<any[] | false>(false)
	const [duuid, setDuuid] = useState<string>("")

	useEffect(() => {
		Device.getId().then((v) => setDuuid(v.uuid))
		http.get(`/devices/family/${appState.familyId}`).then((d) => {
			console.log(d.data)
			if (!d.data) return
			setData(d.data)
		})
	}, [])

	return (
		<BaseLayout title="Settings" tab="home" child={true}>
			<div>
				<p>Notification Token</p> <p>{appState.notificationToken ?? "No Token"}</p>
				<br />
				<p>Family ID</p> <p>{appState.familyId}</p>
				<br />
				<p>Debug Output</p> <p>{appState.debugOutput}</p>
			</div>
			{appState.hasPaid ? (
				<>
					<div className="spacer"></div>
					<h3>Devices</h3>
					<div className="spacer"></div>
					<div className="responsive">
						{data === false ? (
							"Loading..."
						) : (
							<>
								{data.map((device) => (
									<Card hideRipple={true}>
										<h4>
											{device.notificationId === duuid
												? "This device"
												: device.deviceDetails?.name ?? "Web"}
										</h4>
										{device.notificationId === duuid ? null : (
											<p>Operating System: {device.deviceDetails?.os ?? "Web"}</p>
										)}
									</Card>
								))}
							</>
						)}
					</div>
				</>
			) : null}
		</BaseLayout>
	)
}

export default Settings
