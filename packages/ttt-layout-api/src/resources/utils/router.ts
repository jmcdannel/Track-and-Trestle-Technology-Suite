import { Router } from 'express'
import { Layout } from '../layout/model'
import { Loco } from '../loco/model'
import { Effect } from '../effect/model'
import { Route } from '../route/model'
import { Turnout } from '../turnout/model'

export const router = Router()

router.get("/", async (req, res) => {
  res.type('application/json')
	res.send("/api")
})

router.get("/layouts", async (req, res) => {
	const data = await Layout.find()
  res.type('application/json')
	res.send(data)
})

router.get("/layouts/:layoutId", async (req, res) => {
	const data = await Layout.findOne({ layoutId: req.params.layoutId })
  res.type('application/json')
	res.send(data)
})

router.get("/:layoutId/locos", async (req, res) => {
	const data = await Loco.find({ layoutId: req.params.layoutId })
  res.type('application/json')
	res.send(data)
})

router.get("/:layoutId/locos/:id", async (req, res) => {
  const data = await Loco.findOne(
    { 
      layoutId: req.params.layoutId,
      'locos.address': parseInt(req.params.id)
    }, {'locos.$': 1}
  );
  res.type('application/json');
  res.send(data);
});

router.get("/:layoutId/effects", async (req, res) => {
	const data = await Effect.find({ layoutId: req.params.layoutId })
  res.type('application/json')
	res.send(data)
})

router.get("/:layoutId/effects/:id", async (req, res) => {
  const data = await Effect.findOne(
    { 
      layoutId: req.params.layoutId,
      'effects.effectId': parseInt(req.params.id)
    }, {'effects.$': 1}
  );
  res.type('application/json');
  res.send(data);
})

router.get("/:layoutId/turnouts", async (req, res) => {
	const data = await Turnout.find({ layoutId: req.params.layoutId })
  // console.log("/:layoutId/turnouts", data, req.params.layoutId )
  res.type('application/json')
	res.send(data)
})

router.get("/:layoutId/turnouts/:id", async (req, res) => {
  const data = await Turnout.findOne(
    { 
      layoutId: req.params.layoutId,
      'turnouts.turnoutId': parseInt(req.params.id)
    }, {'turnouts.$': 1}
  );
  res.type('application/json');
  res.send(data);
})

router.get("/:layoutId/routes", async (req, res) => {
	const data = await Route.find({ layoutId: req.params.layoutId })
  res.type('application/json')
	res.send(data)
})
