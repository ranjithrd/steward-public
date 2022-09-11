import React from "react"
import { IonButton, IonRippleEffect } from "@ionic/react"
import "./Button.scss"

function Button(props: any) {
	return (
		<IonButton {...props} mode="ios" className="button ripple-parent ion-activatable">
			{props.children}
			<IonRippleEffect />
		</IonButton>
	)
}

export default Button
