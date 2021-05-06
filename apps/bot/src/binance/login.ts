import { Message } from 'discord.js'

export async function login(message: Message) {
  const channel = await message.author.createDM()
  return channel.send(
    `Hello 👋 ! To use the binance bot, please login here first 🎉 ${process.env.FRONT_URL}/?user=${message.author.id}`,
  )
}
