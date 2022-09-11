import { AlertOptions } from "@ionic/react"
import { HookOverlayOptions } from "@ionic/react/dist/types/hooks/HookOverlayOptions"

const VALIDATE_ALL_PURCHASES = true

export class PremiumModule {
	static async purchase(
		alert: (options: AlertOptions & HookOverlayOptions) => Promise<void>,
		onComplete: (receipt: string) => void
	) {
		alert({
			header: "You're buying Steward Premium",
			message: "Please confirm your purchase",
			buttons: [
				{
					text: "Confirm",
					handler: () => {
						// TODO iap logic using package already installed
						const receipt = "hi"
						if (VALIDATE_ALL_PURCHASES) {
							onComplete(receipt)
						} else {
							return
						}
					},
				},
			],
		})
	}
}
