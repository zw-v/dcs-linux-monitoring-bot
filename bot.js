#!/usr/bin/node
const { Telegraf } = require('telegraf')
Tail = require('tail').Tail

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

var chatId = 1065567851

dnsmasq_tail = new Tail('/var/log/dnsmasq')
nextcloud_tail = new Tail('/raid/cloud/files/data/nextcloud.log')

dnsmasq_tail.on('line', function(line) {
	console.log('dnsmasq')
	console.log(line)
	let filtered = line.split(/\s+/)
	if ( filtered[4] == 'DHCPACK(eth1)' ) {
		// let's hope there's no other 'DHCPACK' lines for now...
		let message = '---  ' + filtered[7] + '  --- connected to network'
		bot.telegram.sendMessage(chatId, message)
	}
})

nextcloud_tail.on('line', function(line) {
	let log_entry = JSON.parse(line)
	let log_message = log_entry.message.split(/\s+/)
	
		// only for Login failed:
	if ( log_message[0] == 'Login' && log_message[1] == 'failed:' ) {
		let failed_user = log_message[2]
		let message = '---  ' + failed_user + '  --- tried connecting to cloud and failed'
		bot.telegram.sendMessage(chatId, message)
	}	// different 
	else { 
		bot.telegram.sendMessage(chatId, line)
	}
})

