import React from "react"
import { IonInput, IonItem, IonList, useIonPopover } from "@ionic/react"
import Fuse from "fuse.js"

interface Props {
	val: string | undefined
	placeholder: string
	onChange: (newVal: string) => void
	default: string[]
}

function PopoverList({
	onHide,
	default: d,
	setValue,
}: {
	onHide: () => void
	default: string[]
	setValue: (newVal: string) => void
}) {
	return (
		<IonList>
			{d.map((e) => (
				<IonItem
					button
					onClick={() => {
						setValue(e)
						onHide()
					}}
					key={e}
				>
					{e}
				</IonItem>
			))}
		</IonList>
	)
}

function ChooseAutofillInput(props: Props) {
	function findTags() {
		let initial = [props.val, ...props.default].filter((e) => e && e !== "")
		const fuse = new Fuse(initial)
		initial = fuse.search(props.val ?? "").map((r) => r.item)
		return initial
	}

	const [present, dismiss] = useIonPopover(PopoverList, {
		onHide: () => dismiss(),
		default: findTags(),
		setValue: props.onChange,
	})

	return (
		<>
			<IonInput
				onIonInput={(e) => {
					present({
						event: e,
						showBackdrop: false,
						translucent: true,
						keyboardClose: false,
					})
				}}
				onIonChange={(e) => props.onChange(e.detail.value ?? "")}
				placeholder={props.placeholder}
				value={props.val}
			/>
		</>
	)
}

export default ChooseAutofillInput
