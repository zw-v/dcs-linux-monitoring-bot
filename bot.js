#!/usr/bin/node
const { Telegraf } = require('telegraf')
Tail = require('tail').Tail

const bot = new Telegraf(process.env.BOT_TOKEN)
var chatId = 1065567851

tail = new Tail("/var/log/dnsmasq")

tail.on("line", function(data) {
	let filtered = data.split(/\s+/)
	if ( filtered[4] == 'DHCPACK(eth1)' ) {
		message = filtered[7] + ' connected to network'
		bot.telegram.sendMessage(chatId, message)
	}
})
