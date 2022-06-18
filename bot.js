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

dnsmasq_tail.on('line', function(data) {
	let filtered = data.split(/\s+/)
	if ( filtered[4] == 'DHCPACK(eth1)' ) {
		let message = '---  ' + filtered[7] + '  --- connected to network'
		bot.telegram.sendMessage(chatId, message)
	}
})

nextcloud_tail.on('line', function(data) {
	let data_json = JSON.parse(data)
	let fail_message = data_json.message.split(/\s+/)
	let fail_user = fail_message[2]
	let message = '---  ' + fail_user + '  --- tried connecting to cloud and failed'
	bot.telegram.sendMessage(chatId, message)
})
