import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { CartItem } from "../../types.ts"

const atomCart = atomWithStorage<CartItem[]>("cart", [])

export function useCart() {
  const [cart, setCart] = useAtom(atomCart)

  return { cart, setCart }
}
