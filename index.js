//package.json should contain type: module for import statements to work 
import express from 'express';
import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics();

const client = require('prom-client');
const counter = new client.Counter({
	name: 'metrics_traffic',
	help: 'metrics_traffic_help',
});

const app = express();
//The grafana agents calls this metrics route to get metrics from the node app
app.get('/metrics', async (_req, res) => {
	counter.inc();
	try {
		console.log("pulling");
		res.set('Content-Type', register.contentType);
		res.end(await register.metrics());
	} catch (err) {
		console.log("error");
		res.status(500).end(err);
	}
});

console.log("Running");

app.listen(4001, 'localhost');