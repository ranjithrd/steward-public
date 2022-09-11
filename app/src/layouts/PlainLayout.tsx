import React from "react"
import { IonContent, IonPage, IonBackButton, IonHeader, IonToolbar } from "@ionic/react"
import "./PlainLayout.scss"

function PlainLayout({
	child,
	children: mainContent,
	header,
	footer,
}: {
	child?: boolean
	children?: any
	header?: any
	footer?: any
}) {
	return (
		<IonPage id="main plain">
			{child ? (
				<IonHeader>
					<IonToolbar id="backOnly">
						<IonBackButton />
					</IonToolbar>
				</IonHeader>
			) : null}
			<IonContent fullscreen>
				<div id="wrapper">
					<div id="header">{header ?? null}</div>
					<main>{mainContent}</main>
					<div id="footer">{footer ?? null}</div>
				</div>
			</IonContent>
		</IonPage>
	)
}

export default PlainLayout
