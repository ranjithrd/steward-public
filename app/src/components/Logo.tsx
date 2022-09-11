import React from "react"
import { IonImg } from "@ionic/react"
import logoSvg from "../assets/logo.svg"
import "./Logo.scss"

function Logo() {
	return (
		<div className="logo">
			<IonImg src={logoSvg} />
		</div>
	)
}

export default Logo
