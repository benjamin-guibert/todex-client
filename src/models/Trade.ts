export enum TradeType {
  Sell = 0,
  Buy = 1,
}

export default interface Trade {
  orderId: string
  timestamp: Date
  type: TradeType
  amount: string
  unitPrice: string
  totalPrice: string
}
