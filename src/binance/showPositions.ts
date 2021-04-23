import { Message } from 'discord.js'

export async function showPositions(message: Message, args: string[]) {
  if (args.length === 0) return

  return message.reply('test : ' + args.join(','))
}
