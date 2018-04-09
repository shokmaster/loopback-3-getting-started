'use strict';

const { log } = console;

module.exports = function(app) {
	const models = app.models;

	logModels(models);
};

const logModels = (models) => {
	const modelsNames = Object.keys(models);

	log('---------------------');
	log(`Found ${modelsNames.length} models:`);

	modelsNames.forEach((name) => log(`  - ${name}`));
	log('---------------------\n');
};
