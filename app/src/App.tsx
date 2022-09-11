// Package Imports
import React, { useState } from "react"
import { IonApp, IonRouterOutlet, IonSpinner, IonSplitPane, setupIonicReact } from "@ionic/react"
import { Redirect, Route, RouteComponentProps } from "react-router-dom"
import { IonReactRouter } from "@ionic/react-router"
import { useSnapshot } from "valtio"

// App Imports
import { appState } from "./data/AppState"

// Screen Imports

// general
import Menu from "./components/Menu"
import Home from "./pages/general/Home"
import Details from "./pages/general/Details"
import Introduction from "./pages/general/Introduction"
import Join from "./pages/general/Join"
import Welcome from "./pages/general/Welcome"
import Premium from "./pages/general/Premium"
import Thanks from "./pages/general/Thanks"
import Invite from "./pages/general/Add"
import Settings from "./pages/general/Settings"
import Accept from "./pages/general/Accept"

// chores
import Chores from "./pages/chores/Chores"
import Chore from "./pages/chores/Chore"

// items
import Items from "./pages/items/Items"
import NewItem from "./pages/items/NewItem"
import ManageItems from "./pages/items/ManageItems"
import Buy from "./pages/items/Buy"
import Check from "./pages/items/Check"

// bills
import Bills from "./pages/bills/Bills"
import Bill from "./pages/bills/Bill"

// Ionic Styling
import "@ionic/react/css/core.css"
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

// App Styling
import "./theme/main.scss"

// Init
import { useInitialise } from "./data/Init"

setupIonicReact({
	mode: "md",
})

const App = () => {
	const [screen, setCustomScreen] = useState<any | undefined>()
	const appData = useSnapshot(appState)

	useInitialise(setCustomScreen)

	if (appData.loaded === false) {
		return <IonSpinner />
	}

	console.log(appState.key === "")
	return (
		<IonApp>
			<IonReactRouter>
				<IonSplitPane contentId="main">
					{appData.key === "" ? null : <Menu />}
					{screen ? (
						screen
					) : (
						<IonRouterOutlet id="main">
							<Route path="/welcome" exact={true} component={Welcome} />
							<Route path="/join" exact={true} component={Join} />
							<Route path="/details" exact={true} component={Details} />
							<Route path="/introduction" exact={true} component={Introduction} />
							<Route path="/premium" exact={true} component={Premium} />
							<Route path="/thanks" exact={true} component={Thanks} />

							{/* if no f-key */}
							{appData.key === "" || appData.token === "" ? (
								<Route>
									<Redirect to="/welcome" />
								</Route>
							) : (
								<></>
							)}
							{/* <> */}
							{/* ITEMS */}
							<Route path="/items" exact={true} component={Items} />
							<Route path="/items/add" exact={true} component={NewItem} />
							<Route path="/items/manage" exact={true} component={ManageItems} />
							<Route path="/items/buy" exact={true} component={Buy} />
							<Route path="/items/check" exact={true} component={Check} />

							{/* BILLS */}
							<Route path="/bills" exact={true} component={Bills} />
							<Route path="/bills/:id" exact={true} render={(props) => <Bill {...props} />} />

							{/* CHORES */}
							<Route path="/chores" exact={true}>
								<Chores />
							</Route>
							<Route path="/chores/:id" exact={true} render={(props) => <Chore {...props} />} />

							{/* HOME & GENERAL */}
							<Route path="/home" exact={true} component={Home} />
							<Route path="/premium" exact={true} component={Premium} />
							<Route path="/thanks" exact={true} component={Thanks} />
							<Route path="/invite" exact={true} component={Invite} />
							<Route path="/settings" exact={true} component={Settings} />
							<Route
								path="/accept/:device_id"
								exact={true}
								render={(props: RouteComponentProps<{ device_id: string }>) => (
									<Accept
										deviceId={props.match.params.device_id}
										reset={() => setCustomScreen(undefined)}
									/>
								)}
							/>
							<Route path="/introduction" exact={true} component={Introduction} />
							<Route path="/" exact={true}>
								<Redirect to="/home" />
							</Route>
							{/* <Route>
										<div className="margins">
											<p>
												<code>Error 404</code>
											</p>
											<h1>We couldn't find this page.</h1>
											<p>Please check the URL that you've entered and try once again.</p>
										</div>
									</Route> */}
							{/* </> */}
							{/* )} */}
						</IonRouterOutlet>
					)}
				</IonSplitPane>
			</IonReactRouter>
		</IonApp>
	)
}

export default App
