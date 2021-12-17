import Trade from './Trade'

export default interface Order extends Trade {
  account: string
}
