import { BigInt, Bytes, log } from '@graphprotocol/graph-ts';
import {
    ERC1155OrderFilled,
    ERC721OrderFilled,
    LimitOrderFilled,
} from '../../generated/ExchangeProxy/IZeroEx';
import { ERC1155OrderFill, ERC721OrderFill, Fill, NativeOrderFill } from '../../generated/schema';

import {
    makerFindOrCreate,
    nftFindOrCreate,
    takerFindOrCreate,
    tokenFindOrCreate,
    transactionFindOrCreate,
} from '../utils';

export function handleERC721OrderFilled(event: ERC721OrderFilled): void {
    log.debug('found erc721 order filled in tx {}', [event.transaction.hash.toHex()]);
    let tx = transactionFindOrCreate(event.transaction.hash, event.block);
    let taker = takerFindOrCreate(event.params.taker);
    let maker = makerFindOrCreate(event.params.taker);

    let erc20Token = tokenFindOrCreate(event.params.erc20Token);
    let erc721Token = nftFindOrCreate(event.params.erc721Token, event.params.erc721TokenId, false);


    let nftFill = new ERC721OrderFill(tx.id + '-' + event.logIndex.toString());
    nftFill.transaction = tx.id;
    nftFill.timestamp = tx.timestamp;
    nftFill.blockNumber = tx.blockNumber;
    nftFill.erc20Token = erc20Token.id;
    nftFill.erc721Token = erc721Token.id;
    nftFill.maker = maker.id;
    nftFill.taker = taker.id;
    nftFill.erc20TokenAmount = event.params.erc20TokenAmount;
    nftFill.tradeDirection = event.params.direction == 0 ? 'Buy' : 'Sell';
    nftFill.nonce = event.params.nonce;


    nftFill.save();

    {
        taker.erc721OrderFillCount = taker.erc721OrderFillCount.plus(BigInt.fromI32(1));
        maker.erc721OrderFillCount = maker.erc721OrderFillCount.plus(BigInt.fromI32(1));
        maker.save();
        taker.save();
    }
    {
        tx.save();
    }
}

export function handleERC1155OrderFilled(event: ERC1155OrderFilled): void {
    log.debug('found erc721 order filled in tx {}', [event.transaction.hash.toHex()]);
    let tx = transactionFindOrCreate(event.transaction.hash, event.block);
    let taker = takerFindOrCreate(event.params.taker);
    let maker = makerFindOrCreate(event.params.taker);

    let erc20Token = tokenFindOrCreate(event.params.erc20Token);
    let erc1155Token = nftFindOrCreate(event.params.erc1155Token, event.params.erc1155TokenId, true);


    let nftFill = new ERC1155OrderFill(tx.id + '-' + event.logIndex.toString());
    nftFill.transaction = tx.id;
    nftFill.timestamp = tx.timestamp;
    nftFill.blockNumber = tx.blockNumber;
    nftFill.erc20Token = erc20Token.id;
    nftFill.maker = maker.id;
    nftFill.taker = taker.id;
    nftFill.erc20TokenAmount = event.params.erc20FillAmount;
    nftFill.erc1155TokenAmount = event.params.erc1155FillAmount;
    nftFill.erc1155Token = erc1155Token.id;
    nftFill.tradeDirection = event.params.direction == 0 ? 'Buy' : 'Sell';
    nftFill.nonce = event.params.nonce;

    nftFill.save();

    {
        taker.erc1155OrderFillCount = taker.erc1155OrderFillCount.plus(BigInt.fromI32(1));
        maker.erc1155OrderFillCount = maker.erc1155OrderFillCount.plus(BigInt.fromI32(1));
        maker.save();
        taker.save();
    }
    {
        tx.save();
    }
}

export function handleLimitOrderFilledEvent(event: LimitOrderFilled): void {
    let tx = transactionFindOrCreate(event.transaction.hash, event.block);
    let maker = makerFindOrCreate(event.params.maker);
    let taker = takerFindOrCreate(event.params.taker);

    let inputToken = tokenFindOrCreate(event.params.takerToken);
    let outputToken = tokenFindOrCreate(event.params.makerToken);
    inputToken.limitOrderVolume =
        inputToken.limitOrderVolume.plus(event.params.takerTokenFilledAmount);
    outputToken.limitOrderVolume =
        outputToken.limitOrderVolume.plus(event.params.makerTokenFilledAmount);
    inputToken.save();
    outputToken.save();

    let fill = new Fill(tx.id + event.params.orderHash.toHex() + event.logIndex.toString());
    fill.transaction = tx.id;
    fill.blockNumber = tx.blockNumber;
    fill.timestamp = tx.timestamp;
    fill.logIndex = event.logIndex;
    fill.source = 'LimitOrder';
    fill.recipient = Bytes.fromHexString(taker.id) as Bytes;
    fill.inputToken = inputToken.id;
    fill.outputToken = outputToken.id;
    fill.inputTokenAmount = event.params.takerTokenFilledAmount;
    fill.outputTokenAmount = event.params.makerTokenFilledAmount;
    fill.provider = event.params.maker as Bytes;
    fill.save();

    let nativeFill = new NativeOrderFill(
        tx.id + '-' + event.params.orderHash.toHex() + '-' + event.logIndex.toString(),
    );
    nativeFill.transaction = tx.id;
    nativeFill.blockNumber = tx.blockNumber;
    nativeFill.timestamp = tx.timestamp;
    nativeFill.type = 'LimitOrder';
    nativeFill.maker = maker.id;
    nativeFill.taker = taker.id;
    nativeFill.orderHash = event.params.orderHash;
    nativeFill.inputToken = fill.inputToken;
    nativeFill.outputToken = fill.outputToken;
    nativeFill.inputTokenAmount = fill.inputTokenAmount;
    nativeFill.outputTokenAmount = fill.outputTokenAmount;
    nativeFill.pool = event.params.pool;
    nativeFill.fee = event.params.protocolFeePaid;
    nativeFill.save();

    {
        maker.nativeOrderFillCount = maker.nativeOrderFillCount.plus(BigInt.fromI32(1));
        maker.save();
    }

    {
        taker.nativeOrderFillCount = taker.nativeOrderFillCount.plus(BigInt.fromI32(1));
        taker.save();
    }

    {
        let txFills = tx.fills;
        txFills.push(fill.id);
        tx.fills = txFills;
        tx.save();
    }
}


