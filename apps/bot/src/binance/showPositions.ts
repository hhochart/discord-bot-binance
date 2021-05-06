import { Message } from 'discord.js'
import { decrypt } from '../utils/crypto'
import { getUser, userExist } from '../utils/firebase'
const Binance = require('node-binance-api')

export async function showPositions(message: Message, args: string[]) {
  const userId = message.author.id

  if (!(await userExist(userId))) {
    return message.reply('Please login first using the `!login` command 😘')
  }

  const firebaseUser = await getUser(userId)
  if (!firebaseUser) return

  const binanceApi = new Binance().options({
    APIKEY: firebaseUser.publicApiKey,
    APISECRET: decrypt({
      encryptedContent: firebaseUser.privateApiKey,
      iv: firebaseUser.iv,
    }).content,
  })

  const positions = await binanceApi.futuresPositionRisk()

  const pos = positions.filter((p: any) => Number(p.positionAmt) !== 0)
  console.log(pos)

  if (pos.length === 0)
    message.reply(`No positions ongoing. You're safe to sleep 😴`)

  const messagesToSend = pos.map(async (p: any) => {
    const profit = Number(p.unRealizedProfit).toFixed(2)
    const amount = Number(p.positionAmt).toFixed(2)
    const entry = Number(p.entryPrice).toFixed(2)
    const market = Number(p.markPrice).toFixed(2)
    return message.reply(
      `[**${p.symbol}** x${[p.leverage]}] ${
        amount > '0' ? '📈' : '📉'
      } ${amount} ${p.symbol.replace('USDT', '')} | ${
        profit > '0' ? '🟢' : '🔴'
      } **$${profit}** pnl | entry ${entry} | market ${market}`,
    )
  })

  await message.delete()
  return await Promise.all(messagesToSend)
}
