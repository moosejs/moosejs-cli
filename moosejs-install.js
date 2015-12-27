#!/usr/bin/env node

var program = require('commander'),
	prompt = require('prompt'),
	log = require('cedar')(),
	shelljs = require('shelljs/global'),
	shellConfig = require('shelljs').config,
	Util = require('./utils');

shellConfig.silent = true;

log.prefixes = {
  trace: 'TRACE: '.cyan,
  debug: 'DEBUG: '.magenta,
  log:   'LOG:   '.gray,
  info:  'INFO:  '.green,
  warn:  'WARN:  '.yellow,
  error: 'ERROR: '.red,
  fatal: 'FATAL: '.red
};

program
	.option('-p, --path [targetPath]', 'installation path', process.cwd())
	.parse(process.argv);

if(program.args.length) {
	install(program.args[0]);
}else{
	prompt.message = "MooseJS".cyan;

	prompt.start();

	var property = {
		name: 'component',
		message: 'Which component do you wish to install? (server, daemon)',
		validator: /^s([erver])?|^d([aemon])?/,
		warning: 'server or deamon?',
		default: 'server',
	};

	prompt.get(property, function (err, result) {
		install(result.component);
	});
}

function install(component){
	var archiveUrl, targetPath = program.path;

	console.log(targetPath);

	// if(/^s([erver])?/.test(component)){
	// 	archiveUrl = "https://github.com/moosejs/moosejs/archive/master.zip";
	// }else{
	// 	log("installing daemon");
	// }
	// log.info('Download zip archive '+archiveUrl.cyan);
	// Util.fetchArchive(targetPath+'/'+'moose',archiveUrl).then(function(){
	// 	log.info("Unzipping and moving");
	// 	try	{
	// 		cp('-Rf', targetPath + '/moose/moosejs-master/*', targetPath+'/moose');
	// 	} catch(e){
	// 		log.error(e);
	// 	}
	// 	log.info("Done");
	// });
}