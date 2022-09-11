import React from "react"
import {
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	IonRefresher,
	IonRefresherContent,
	IonBackButton,
} from "@ionic/react"
import NavigationBar from "../components/Bar"
import { Sync } from "../data/Sync"
import { RefresherEventDetail } from "@ionic/core"
import "./BaseLayout.scss"

function BaseLayout({ title, tab, child, children }: { title: string; tab: string; child?: boolean; children?: any }) {
	function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
		Sync.syncRemote()
			.catch((e) => {
				throw e
			})
			.then(() => {
				event.detail.complete()
			})
	}

	return (
		<IonPage id="main base">
			<IonHeader>
				<IonToolbar id="toolbar">
					<IonButtons slot="start">{child ? <IonBackButton /> : <IonMenuButton />}</IonButtons>
					<IonTitle slot="start">{title}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
					<IonRefresherContent></IonRefresherContent>
				</IonRefresher>

				<main>{children}</main>
			</IonContent>

			<NavigationBar tab={tab} />
		</IonPage>
	)
}

export default BaseLayout
