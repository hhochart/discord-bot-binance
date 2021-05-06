import firebase from 'firebase'
import 'firebase/firestore'

const configKeys = {
  apiKey:
    process.env.FIREBASE_API_KEY ?? 'AIzaSyDjqnwL_6N4DSrxvIEOyLM68jJt_73hi38',
  projectId: process.env.FIREBASE_PROJECT_ID ?? 'binance-discord-bot',
  appId:
    process.env.FIREBASE_APP_ID ?? '1:904246732302:web:84bd33c8496028e5bc7e5f',
}

const getFirestore = () => {
  const firestore = !firebase.apps.length
    ? firebase.initializeApp(configKeys).firestore()
    : firebase.app().firestore()

  return firestore
}

export const firestore = getFirestore()

export async function userExist(userId: string): Promise<boolean> {
  const userDocReference = firestore.collection('users').doc(userId)

  return (await userDocReference.get()).exists
}

interface IUser {
  publicApiKey: string
  privateApiKey: string
  iv: string
}

export async function getUser(userId: string): Promise<undefined | IUser> {
  const userDocReference = firestore.collection('users').doc(userId)
  const userSnapshot = await userDocReference.get()

  if (!userSnapshot.exists) return undefined

  return userSnapshot.data() as IUser
}
