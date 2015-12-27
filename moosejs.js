#!/usr/bin/env node

var program = require('commander');

program
    .version('0.0.1')
    .usage('<command> [--options]')
    .command('install [component]', 'Install the MooseJS web server or daemon (server, daemon)')
    .parse(process.argv)

if(!program.args.length) {
    program.help();
}