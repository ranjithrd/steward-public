import { IonRippleEffect } from "@ionic/react"
import React from "react"

function SmallOutlined(props: any) {
	return (
		<button
			className={`center ${
				props.fontSize !== "normal" ? "medium" : ""
			} danger outline ion-activatable ripple-parent`}
			{...props}
		>
			<IonRippleEffect />
			{props.children}
		</button>
	)
}

export default SmallOutlined
