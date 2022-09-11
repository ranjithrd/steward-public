function appLog(item) {
	console.log("\x1b[33m%s\x1b[0m", item)
}
function infoLog(item) {
	console.log("\x1b[36m%s\x1b[0m", item)
}
function debugLog(item) {
	if (DEBUG_MODE) console.log(item)
}
function error(item) {
	console.log("\x1b[31m%s\x1b[0m", item)
}

const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const { MongoClient, ObjectId } = require("mongodb")
const axios = require("axios")
const bcrypt = require("bcrypt")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 1115
const DEBUG_MODE = process.env.DEBUG_MODE === "true" || false
const DATABASE_URI = process.env.DB_URI
const saltRounds = 10

const client = new MongoClient(DATABASE_URI)
const db = client.db("app")

app.use(cors())
app.use(express.json())

async function createToken(deviceId, familyId) {
	const data = { deviceId: deviceId, familyId: familyId }
	const dString = `d:${deviceId};f:${familyId}`
	return JSON.stringify({
		data,
		verification: await bcrypt.hash(dString, saltRounds),
	})
}

async function verifyToken(token) {
	console.log(token)
	const data = JSON.parse(token)
	const d = data.data ?? {}
	const s = `d:${d.deviceId};f:${d.familyId}`
	const t = data?.verification ?? ""
	return await bcrypt.compare(s, t)
}

app.get("/", (_, res) => res.send(`Running server on port ${PORT}`))

app.post("/create", async (req, res) => {
	const body = req.body
	if (
		!body.code ||
		!body.data ||
		!body.receipt ||
		!body.premium ||
		!body.deviceId
	) {
		res.sendStatus(400)
		return
	}
	if (body.premium !== true) {
		res.sendStatus(400)
		return
	}
	const ALWAYS_ALLOW_PREMIUM = true
	if (!ALWAYS_ALLOW_PREMIUM) {
		// TODO verify purchase
	}
	// all verified!
	const resultId = await db.collection("families").insertOne({
		code: body.code,
		data: body.data,
		active: false,
	})
	const r = await db.collection("devices").insertOne({
		notificationId: body.deviceId,
		requestingFamily: body.code,
		confirmation: {
			familyId: resultId.insertedId.toString(),
		},
	})
	res.send({
		id: resultId,
		token: await createToken(
			r.insertedId.toString(),
			resultId.insertedId.toString()
		),
	})
})

app.post("/update/:id", async (req, res) => {
	if (!req.headers.token) {
		res.sendStatus(400)
		return
	}
	const v = await verifyToken(req.headers.token ?? "{}")
	if (!v) {
		res.sendStatus(403)
		return
	}
	const newData = [req.body].map(({ _id, ...other }) => ({
		...other,
	}))[0]
	console.log("updating")
	console.log(req.params.id)
	await db
		.collection("families")
		.updateOne(
			{
				_id: ObjectId(req.params.id),
			},
			{
				$set: { ...newData },
			}
		)
		.catch((e) => res.send(e))
	res.end()
})

app.post("/device/register", async (req, res) => {
	const newData = req.body
	console.log(newData)
	if (
		!newData.deviceDetails ||
		!newData.publicKey ||
		!newData.requestingFamily ||
		!newData.notificationId
	) {
		res.sendStatus(400)
		return
	}
	const data = {
		deviceDetails: newData.deviceDetails,
		publicKey: newData.publicKey,
		requestingFamily: newData.requestingFamily,
		notificationId: newData.notificationId,
		confirmation: {
			familyCode: "null",
			familyId: "null",
			familyKey: "null",
		},
	}
	debugLog(data)
	const doc = await db.collection("devices").insertOne(data)
	debugLog(doc)
	res.send(doc.insertedId)
	const familyData = await db.collection("families").findOne({
		code: newData.requestingFamily ?? 0,
	})
	const devices = await (await db.collection("devices").find()).toArray()
	// const notifyDevices = await (
	// 	await db.collection("devices").find({
	// 		"confirmation.familyId": familyData._id,
	// 	})
	// ).toArray()
	const notifyDevices = devices.filter(
		(e) => e.confirmation?.familyId === familyData._id.toString()
	)
	if (!familyData) return
	notify(
		notifyDevices.map((u) => u.notificationId),
		"Approve this user",
		"Click to allow this new user to enter the family",
		{
			type: "approve",
			deviceId: doc.insertedId,
		}
	)
})

app.get("/device/info/:id", async (req, res) => {
	const details = await db.collection("devices").findOne({
		_id: ObjectId(req.params.id),
	})
	debugLog(details)
	res.send(details)
})

app.post("/device/approve", async (req, res) => {
	console.log("approve")
	const updatedData = req.body
	if (updatedData.approval === true) {
		if (
			!updatedData.familyCode ||
			!updatedData.familyId ||
			!updatedData.familyKey ||
			!updatedData.deviceId
		) {
			res.sendStatus(400)
			return
		}
		console.log(updatedData)
		const r = await db.collection("devices").updateOne(
			{
				_id: ObjectId(updatedData.deviceId),
			},
			{
				$set: {
					confirmation: {
						familyCode: updatedData.familyCode,
						familyId: updatedData.familyId,
						familyKey: updatedData.familyKey,
					},
					token: await createToken(
						updatedData.deviceId,
						updatedData.familyId
					),
				},
			}
		)
		console.log(r.acknowledged)
		res.end()
	}
	if (updatedData.approval === false) {
		if (!updatedData.deviceId) {
			res.sendStatus(400)
		}
		await db.collection("devices").updateOne(
			{
				_id: ObjectId(updatedData.deviceId),
			},
			{
				$set: {
					confirmation: {
						familyCode: "not approved",
						familyId: "not approved",
						familyKey: "not approved",
					},
				},
			}
		)
		res.end()
	}
	res.sendStatus(400)
	return
})

app.get("/devices/family/:id", async (req, res) => {
	if (req.params.id) {
		const result = await db.collection("devices").find({
			confirmation: {
				familyId: req.params.id,
			},
		})
		res.send(await result.toArray())
	} else {
		res.sendStatus(400)
	}
})

async function notify(deviceIds, header, text, data) {
	const r = await axios
		.post(
			"https://onesignal.com/api/v1/notifications",
			{
				app_id: "NOT PUBLIC",
				include_external_user_ids: deviceIds,
				...(header
					? { headings: { en: header }, contents: { en: text } }
					: {}),
				...(data ? { data } : {}),
			},
			{
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					Authorization:
						"Basic NOT PUBLIC",
				},
			}
		)
		.catch((e) => appLog(e))
	console.log(deviceIds)
	console.log(r?.data)
}

// const testKey =
// app.get("/notifytest", async (req, res) => {
// 	await notify([testKey], "H1", "from server")
// 	res.end()
// })

app.get("/:id", async (req, res) => {
	if (!req.headers.token) {
		res.sendStatus(400)
		return
	}
	const v = await verifyToken(req.headers.token ?? "{}")
	if (!v) {
		res.sendStatus(403)
		return
	}
	const data = await db
		.collection("families")
		.findOne({
			_id: ObjectId(req.params.id),
		})
		.catch((error) => res.sendStatus(500))
	res.send(data)
})

async function start() {
	if (!DATABASE_URI) {
		error("Could not find a DB URI.")
		error("Cannot proceed.")
		return
	}

	try {
		appLog("Connecting to Mongo...")
		await client.connect()
		await client.db("admin").command({ ping: 1 })
		appLog("Successfully connected.")
	} catch (e) {
		error("Connection error.")
		error(e)
		return
	}

	app.listen(PORT, () => {
		appLog(`Server listening to port ${PORT}`)
	})
}

start()
