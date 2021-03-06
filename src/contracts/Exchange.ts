/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface ExchangeInterface extends utils.Interface {
  functions: {
    "cancelOrder(uint256)": FunctionFragment;
    "createOrder(address,uint256,address,uint256)": FunctionFragment;
    "depositEther()": FunctionFragment;
    "depositToken(address,uint256)": FunctionFragment;
    "ethBalanceOf(address)": FunctionFragment;
    "feeAccount()": FunctionFragment;
    "feePercent()": FunctionFragment;
    "fillOrder(uint256)": FunctionFragment;
    "orders(uint256)": FunctionFragment;
    "tokenBalanceOf(address,address)": FunctionFragment;
    "withdrawEther(uint256)": FunctionFragment;
    "withdrawToken(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "cancelOrder",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createOrder",
    values: [string, BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositEther",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "depositToken",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ethBalanceOf",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "feeAccount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "feePercent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fillOrder",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "orders",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenBalanceOf",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawEther",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawToken",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "cancelOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositEther",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ethBalanceOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "feeAccount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feePercent", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fillOrder", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "orders", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenBalanceOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawEther",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawToken",
    data: BytesLike
  ): Result;

  events: {
    "CancelOrder(uint256,address,address,uint256,address,uint256)": EventFragment;
    "CreateOrder(uint256,address,address,uint256,address,uint256,uint256)": EventFragment;
    "DepositEther(address,uint256,uint256)": EventFragment;
    "DepositToken(address,address,uint256,uint256)": EventFragment;
    "Trade(uint256,address,address,uint256,address,address,uint256,uint256)": EventFragment;
    "WithdrawEther(address,uint256,uint256)": EventFragment;
    "WithdrawToken(address,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CancelOrder"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CreateOrder"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DepositEther"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DepositToken"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Trade"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawEther"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawToken"): EventFragment;
}

export type CancelOrderEvent = TypedEvent<
  [BigNumber, string, string, BigNumber, string, BigNumber],
  {
    id: BigNumber;
    account: string;
    sellToken: string;
    sellAmount: BigNumber;
    buyToken: string;
    buyAmount: BigNumber;
  }
>;

export type CancelOrderEventFilter = TypedEventFilter<CancelOrderEvent>;

export type CreateOrderEvent = TypedEvent<
  [BigNumber, string, string, BigNumber, string, BigNumber, BigNumber],
  {
    id: BigNumber;
    account: string;
    sellToken: string;
    sellAmount: BigNumber;
    buyToken: string;
    buyAmount: BigNumber;
    timestamp: BigNumber;
  }
>;

export type CreateOrderEventFilter = TypedEventFilter<CreateOrderEvent>;

export type DepositEtherEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  { account: string; amount: BigNumber; newBalance: BigNumber }
>;

export type DepositEtherEventFilter = TypedEventFilter<DepositEtherEvent>;

export type DepositTokenEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  { account: string; token: string; amount: BigNumber; newBalance: BigNumber }
>;

export type DepositTokenEventFilter = TypedEventFilter<DepositTokenEvent>;

export type TradeEvent = TypedEvent<
  [BigNumber, string, string, BigNumber, string, string, BigNumber, BigNumber],
  {
    orderId: BigNumber;
    sellAccount: string;
    sellToken: string;
    sellAmount: BigNumber;
    buyAccount: string;
    buyToken: string;
    buyAmount: BigNumber;
    timestamp: BigNumber;
  }
>;

export type TradeEventFilter = TypedEventFilter<TradeEvent>;

export type WithdrawEtherEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  { account: string; amount: BigNumber; newBalance: BigNumber }
>;

export type WithdrawEtherEventFilter = TypedEventFilter<WithdrawEtherEvent>;

export type WithdrawTokenEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  { account: string; token: string; amount: BigNumber; newBalance: BigNumber }
>;

export type WithdrawTokenEventFilter = TypedEventFilter<WithdrawTokenEvent>;

export interface Exchange extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ExchangeInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    cancelOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createOrder(
      _sellToken: string,
      _sellAmount: BigNumberish,
      _buyToken: string,
      _buyAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositEther(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ethBalanceOf(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    feeAccount(overrides?: CallOverrides): Promise<[string]>;

    feePercent(overrides?: CallOverrides): Promise<[BigNumber]>;

    fillOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    orders(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        number,
        string,
        string,
        BigNumber,
        string,
        BigNumber,
        BigNumber
      ] & {
        id: BigNumber;
        status: number;
        account: string;
        sellToken: string;
        sellAmount: BigNumber;
        buyToken: string;
        buyAmount: BigNumber;
        timestamp: BigNumber;
      }
    >;

    tokenBalanceOf(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    withdrawEther(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  cancelOrder(
    _id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createOrder(
    _sellToken: string,
    _sellAmount: BigNumberish,
    _buyToken: string,
    _buyAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositEther(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositToken(
    _token: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ethBalanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  feeAccount(overrides?: CallOverrides): Promise<string>;

  feePercent(overrides?: CallOverrides): Promise<BigNumber>;

  fillOrder(
    _id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  orders(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      number,
      string,
      string,
      BigNumber,
      string,
      BigNumber,
      BigNumber
    ] & {
      id: BigNumber;
      status: number;
      account: string;
      sellToken: string;
      sellAmount: BigNumber;
      buyToken: string;
      buyAmount: BigNumber;
      timestamp: BigNumber;
    }
  >;

  tokenBalanceOf(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  withdrawEther(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawToken(
    _token: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    cancelOrder(_id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    createOrder(
      _sellToken: string,
      _sellAmount: BigNumberish,
      _buyToken: string,
      _buyAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    depositEther(overrides?: CallOverrides): Promise<void>;

    depositToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    ethBalanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    feeAccount(overrides?: CallOverrides): Promise<string>;

    feePercent(overrides?: CallOverrides): Promise<BigNumber>;

    fillOrder(_id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    orders(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        number,
        string,
        string,
        BigNumber,
        string,
        BigNumber,
        BigNumber
      ] & {
        id: BigNumber;
        status: number;
        account: string;
        sellToken: string;
        sellAmount: BigNumber;
        buyToken: string;
        buyAmount: BigNumber;
        timestamp: BigNumber;
      }
    >;

    tokenBalanceOf(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawEther(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "CancelOrder(uint256,address,address,uint256,address,uint256)"(
      id?: null,
      account?: null,
      sellToken?: null,
      sellAmount?: null,
      buyToken?: null,
      buyAmount?: null
    ): CancelOrderEventFilter;
    CancelOrder(
      id?: null,
      account?: null,
      sellToken?: null,
      sellAmount?: null,
      buyToken?: null,
      buyAmount?: null
    ): CancelOrderEventFilter;

    "CreateOrder(uint256,address,address,uint256,address,uint256,uint256)"(
      id?: null,
      account?: null,
      sellToken?: null,
      sellAmount?: null,
      buyToken?: null,
      buyAmount?: null,
      timestamp?: null
    ): CreateOrderEventFilter;
    CreateOrder(
      id?: null,
      account?: null,
      sellToken?: null,
      sellAmount?: null,
      buyToken?: null,
      buyAmount?: null,
      timestamp?: null
    ): CreateOrderEventFilter;

    "DepositEther(address,uint256,uint256)"(
      account?: null,
      amount?: null,
      newBalance?: null
    ): DepositEtherEventFilter;
    DepositEther(
      account?: null,
      amount?: null,
      newBalance?: null
    ): DepositEtherEventFilter;

    "DepositToken(address,address,uint256,uint256)"(
      account?: null,
      token?: null,
      amount?: null,
      newBalance?: null
    ): DepositTokenEventFilter;
    DepositToken(
      account?: null,
      token?: null,
      amount?: null,
      newBalance?: null
    ): DepositTokenEventFilter;

    "Trade(uint256,address,address,uint256,address,address,uint256,uint256)"(
      orderId?: null,
      sellAccount?: null,
      sellToken?: null,
      sellAmount?: null,
      buyAccount?: null,
      buyToken?: null,
      buyAmount?: null,
      timestamp?: null
    ): TradeEventFilter;
    Trade(
      orderId?: null,
      sellAccount?: null,
      sellToken?: null,
      sellAmount?: null,
      buyAccount?: null,
      buyToken?: null,
      buyAmount?: null,
      timestamp?: null
    ): TradeEventFilter;

    "WithdrawEther(address,uint256,uint256)"(
      account?: null,
      amount?: null,
      newBalance?: null
    ): WithdrawEtherEventFilter;
    WithdrawEther(
      account?: null,
      amount?: null,
      newBalance?: null
    ): WithdrawEtherEventFilter;

    "WithdrawToken(address,address,uint256,uint256)"(
      account?: null,
      token?: null,
      amount?: null,
      newBalance?: null
    ): WithdrawTokenEventFilter;
    WithdrawToken(
      account?: null,
      token?: null,
      amount?: null,
      newBalance?: null
    ): WithdrawTokenEventFilter;
  };

  estimateGas: {
    cancelOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createOrder(
      _sellToken: string,
      _sellAmount: BigNumberish,
      _buyToken: string,
      _buyAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositEther(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ethBalanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    feeAccount(overrides?: CallOverrides): Promise<BigNumber>;

    feePercent(overrides?: CallOverrides): Promise<BigNumber>;

    fillOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    orders(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    tokenBalanceOf(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawEther(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    cancelOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createOrder(
      _sellToken: string,
      _sellAmount: BigNumberish,
      _buyToken: string,
      _buyAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositEther(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ethBalanceOf(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    feeAccount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feePercent(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fillOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    orders(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenBalanceOf(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdrawEther(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawToken(
      _token: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
