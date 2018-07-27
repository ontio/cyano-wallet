export type Network = 'MAIN' | 'TEST' | 'PRIVATE';

export type Asset = 'ONT' | 'ONG';

export enum TransactionType {
    BookKeeper = 2,
    Claim = 3,
    Deploy = 208,
    Invoke = 209,
    Enrollment = 4,
    Vote = 5
}

export type EventListener = (data: any) => void;

export interface Parameter {
    value: string;
}

export interface BlockHeader {
    Version: number;
    PrevBlockHash: string;
    TransactionsRoot: string;
    BlockRoot: string;
    Timestamp: number;
    Height: number;
    ConsensusData: number;
    ConsensusPayload: string;
    NextBookkeeper: string,
    Bookkeepers: string[],
    SigData: string[],
    Hash: string
}

export interface Block {
    Hash: string;
    Size: number;
    Header: BlockHeader;
    Transactions: Transaction[];
}

export interface Signature {
    PubKeys: string[];
    M: number;
    SigData: string[];
}

export interface Transaction {
    Version: number;
    Nonce: number;
    GasPrice: number;
    GasLimit: number;
    Payer: string;
    TxType: TransactionType;
    Payload: any;
    Attributes: any[];
    Sigs: Signature[];
    Hash: string;
    Height: number;
}

export interface MerkleProof {
    Type: string;
    TransactionsRoot: string;
    BlockHeight: number;
    CurBlockRoot: string;
    CurBlockHeight: number;
    TargetHashes: string[];
}
