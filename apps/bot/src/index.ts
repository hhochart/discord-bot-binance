import { Client, Constants } from 'discord.js'
import { config as dotenvConfig } from 'dotenv'
import { login } from './binance/login'
import { showPositions } from './binance/showPositions'
import { Commands } from './types/commands'
dotenvConfig()

const prefix = '$'

export const client = new Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on(Constants.Events.MESSAGE_CREATE, (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const commandBody = message.content.slice(prefix.length)
  const [command, ...args] = commandBody.split(' ')

  switch (command) {
    case Commands.SHOW_POSITIONS:
      return showPositions(message, args)

    case Commands.LOGIN:
      return login(message)

    default:
      return
  }
})

client.login(process.env.DISCORD_TOKEN).catch
