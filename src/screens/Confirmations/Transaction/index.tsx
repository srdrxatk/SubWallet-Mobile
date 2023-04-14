import React, { useCallback, useMemo } from 'react';
import { ConfirmationDefinitions, ExtrinsicType } from '@subwallet/extension-base/background/KoniTypes';
import { BaseTransactionConfirmation } from 'screens/Confirmations/Transaction/variants/Base';
import { ConfirmationQueueItem } from 'stores/base/RequestState';
import { useSelector } from 'react-redux';
import { RootState } from 'stores/index';
import { SigningRequest } from '@subwallet/extension-base/background/types';
import useParseSubstrateRequestPayload from 'hooks/transaction/confirmation/useParseSubstrateRequestPayload';
import { SWTransactionResult } from '@subwallet/extension-base/services/transaction-service/types';
import { JoinPoolTransactionConfirmation, SendNftTransactionConfirmation } from './variants';
import { View } from 'react-native';
import { SubstrateSignArea } from 'screens/Confirmations/parts/Sign/Substrate';
import { EvmSignArea } from 'screens/Confirmations/parts/Sign/Evm';
import LeavePoolTransactionConfirmation from "screens/Confirmations/Transaction/variants/LeavePool";
import UnbondTransactionConfirmation from "screens/Confirmations/Transaction/variants/Unbond";

interface Props {
  confirmation: ConfirmationQueueItem;
}

const getTransactionComponent = (extrinsicType: ExtrinsicType): typeof BaseTransactionConfirmation => {
  console.log('extrinsicType', extrinsicType);
  switch (extrinsicType) {
    // case ExtrinsicType.TRANSFER_BALANCE:
    // case ExtrinsicType.TRANSFER_TOKEN:
    // case ExtrinsicType.TRANSFER_XCM:
    //   return TransferBlock;
    case ExtrinsicType.SEND_NFT:
      return SendNftTransactionConfirmation;
    case ExtrinsicType.STAKING_JOIN_POOL:
      return JoinPoolTransactionConfirmation;
    case ExtrinsicType.STAKING_LEAVE_POOL:
      return LeavePoolTransactionConfirmation;
    // case ExtrinsicType.STAKING_BOND:
    //   return BondTransactionConfirmation;
    case ExtrinsicType.STAKING_UNBOND:
      return UnbondTransactionConfirmation;
    // case ExtrinsicType.STAKING_WITHDRAW:
    //   return WithdrawTransactionConfirmation;
    // case ExtrinsicType.STAKING_CLAIM_REWARD:
    //   return ClaimRewardTransactionConfirmation;
    // case ExtrinsicType.STAKING_CANCEL_UNSTAKE:
    //   return CancelUnstakeTransactionConfirmation;
    default:
      return BaseTransactionConfirmation;
  }
};

export const TransactionConfirmation = (props: Props) => {
  const {
    confirmation: { item, type },
  } = props;
  const { id } = item;

  const { transactionRequest } = useSelector((state: RootState) => state.requestState);
  console.log('transactionRequest', transactionRequest);

  const _transaction = useMemo(() => transactionRequest[id], [transactionRequest, id]);

  const substratePayload = useParseSubstrateRequestPayload(
    type === 'signingRequest' ? (item as SigningRequest).request : undefined,
  );
  console.log('_transaction', _transaction);

  const renderContent = useCallback((transaction: SWTransactionResult): React.ReactNode => {
    const { extrinsicType } = transaction;

    const Component = getTransactionComponent(extrinsicType);

    return <Component transaction={transaction} />;
  }, []);
  return (
    <>
      <View style={{ flex: 1 }}>{renderContent(_transaction)}</View>
      {type === 'signingRequest' && (
        <SubstrateSignArea account={(item as SigningRequest).account} id={item.id} payload={substratePayload} />
      )}
      {type === 'evmSendTransactionRequest' && (
        <EvmSignArea
          id={item.id}
          payload={item as ConfirmationDefinitions['evmSendTransactionRequest'][0]}
          type="evmSendTransactionRequest"
        />
      )}
    </>
  );
};