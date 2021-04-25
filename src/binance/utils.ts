import { config as dotenvConfig } from 'dotenv'
import * as crypto from 'crypto'
import got from 'got'
dotenvConfig()

let binanceApiWeightTracker = 0
let binanceApiCurrentWeight = 0

function timestamp() {
  return Date.now()
}

function signature(queryString: string, secretKey: string) {
  return crypto
    .createHmac('sha256', secretKey)
    .update(queryString)
    .digest('hex')
}

module.exports = {
  async gotHandler(
    url: string,
    binanceApiKey: string,
    binanceSecretKey: string,
    params: any,
    weight: string,
  ) {
    let response
    try {
      // Set all queryParam to build a totalParam query string
      const totalParams = []
      const urlSearchParams = []

      const currentTimestamp = timestamp()
      const timestampParam = `timestamp=${currentTimestamp}`

      if (params !== null) {
        Object.keys(params).forEach((key) => {
          totalParams.push(`${key}=${params[key]}`)
          urlSearchParams.push([key, params[key]])
        })
        totalParams.push(timestampParam)
        totalParams.join('&')
      } else {
        totalParams.push(timestampParam)
      }

      // Build signature totalParam
      const signatureValue = signature(totalParams.join(''), binanceSecretKey)

      // Build searchParams and headers based on queryParams, signature and binance API key
      urlSearchParams.push(['timestamp', currentTimestamp])
      urlSearchParams.push(['signature', signatureValue])

      const searchParams = new URLSearchParams(urlSearchParams.join(''))
      const headers = { 'X-MBX-APIKEY': binanceApiKey }

      // send request to binance API to get deposit
      response = await got(url, { searchParams, headers })

      if (response == null) return

      // Set the binance api used weight tracker
      if (weight != null) {
        binanceApiCurrentWeight = Number(
          response.headers['x-mbx-used-weight-1m'],
        )
      } else {
        binanceApiCurrentWeight += 1
      }
      binanceApiWeightTracker = binanceApiCurrentWeight

      return JSON.parse(response.body)
    } catch (error) {
      console.log(error)
    }
  },

  // QueueHandler run constantly to catch every new item push in the queue and process them
  // Queue only receive object with data to call binance api
  // Make binance API call synchronously permit to track the binance API used weight
  // If limit reached, queueHandler stop sending binance API request during 60 seconds
  async queueHandler() {
    const binanceApiMaxWeight = parseInt(process.env.BINANCE_API_MAX_WEIGHT)
    if (binanceApiWeightTracker < binanceApiMaxWeight) {
      if (binanceApiRequestQueue.length > 0 && isFetching === false) {
        console.log('Processing new request...')
        isFetching = true
        const queueItem = binanceApiRequestQueue.shift()
        await itemManager(queueItem)
        console.log('Request processed')
        console.log(`Binance API current weight : ${binanceApiWeightTracker}`)
        isFetching = false
      }
      setTimeout(queueHandler)
    } else {
      console.log('Binance rate limit API reached, starting 60s timeout')
      binanceApiWeightTracker = 0
      setTimeout(queueHandler, 60000)
    }
  },
}
