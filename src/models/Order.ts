import { TradeType } from './Trade'

export default interface Order {
  id?: string
  timestamp?: Date
  type: TradeType
  account: string
  amount: string
  unitPrice?: string
  totalPrice: string
}
