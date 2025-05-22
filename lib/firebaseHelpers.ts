import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { app } from "./firebase" // kendi firebase.ts dosyana göre bu importu ayarla

const db = getFirestore(app)

/**
 * Save categories selected by the user
 */
export const saveUserCategories = async (userId: string, categories: string[]) => {
  const userRef = doc(db, "userPreferences", userId)
  await setDoc(userRef, { categories })
}

/**
 * Get categories saved by the user
 */
export const getUserCategories = async (userId: string): Promise<string[]> => {
  const userRef = doc(db, "userPreferences", userId)
  const docSnap = await getDoc(userRef)

  if (docSnap.exists()) {
    const data = docSnap.data()
    return data.categories || []
  } else {
    return []
  }
}

/**
 * Alternative for NewsCategories component
 */
export const saveUserPreferences = async ({ categories }: { categories: string[] }) => {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) throw new Error("Not authenticated")

  await saveUserCategories(user.uid, categories)
}
