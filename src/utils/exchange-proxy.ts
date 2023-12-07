import { BigInt } from "@graphprotocol/graph-ts";

import { Fill, Transaction } from "../../generated/schema";


export function findSwapEventFills(tx: Transaction, logIndex: BigInt | null = null): Fill[] {


    let txFills = tx.fills; // can't index directly
    let fills = [] as Fill[];
    for (let i = 0; i < txFills.length; ++i) {
        let fillId = txFills[i];
        let fill = Fill.load(fillId) as Fill;
        if (!fill.logIndex) {
            continue;
        }
        if (logIndex) {
            // Must be before this swap event.
            if (logIndex.lt((fill.logIndex as BigInt))) {
                continue;
            }
        }
        fills.push(fill!);
    }
    return fills;
}







