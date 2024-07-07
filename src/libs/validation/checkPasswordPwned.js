import { pwnedPassword } from 'hibp'

export const checkPasswordPwned = async (password) => {
  const breachCount = await pwnedPassword(password)
  return breachCount > 0
}
