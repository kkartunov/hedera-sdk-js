import * as proto from "@hashgraph/proto";
import Channel from "../channel/Channel";
import Transaction, { TRANSACTION_REGISTRY } from "../Transaction";
import { Key } from "@hashgraph/cryptography";
import { _fromProtoKey, _toProtoKey } from "../util";
import AccountId from "./AccountId";
import Timestamp from "../Timestamp";
import Long from "long";

/**
 * Change properties for the given account.
 */
export default class AccountUpdateTransaction extends Transaction {
    /**
     * @param {object} props
     * @param {AccountId} [props.accountId]
     * @param {Key} [props.key]
     * @param {boolean} [props.receiverSignatureRequired]
     * @param {AccountId} [props.proxyAccountId]
     * @param {number | Long} [props.autoRenewPeriod]
     * @param {Timestamp | Date} [props.expirationTime]
     */
    constructor(props = {}) {
        super();

        /**
         * @private
         * @type {?AccountId}
         */
        this._accountId = null;

        if (props.accountId != null) {
            this.setAccountId(props.accountId);
        }

        /**
         * @private
         * @type {?Key}
         */
        this._key = null;

        if (props.key != null) {
            this.setKey(props.key);
        }

        /**
         * @private
         * @type {boolean}
         */
        this._receiverSignatureRequired = false;

        if (props.receiverSignatureRequired != null) {
            this.setReceiverSignatureRequired(props.receiverSignatureRequired);
        }

        /**
         * @private
         * @type {?AccountId}
         */
        this._proxyAccountId = null;

        if (props.proxyAccountId != null) {
            this.setProxyAccountId(props.proxyAccountId);
        }

        /**
         * @private
         * @type {?Long}
         */
        this._autoRenewPeriod = null;

        if (props.autoRenewPeriod != null) {
            this.setAutoRenewPeriod(props.autoRenewPeriod);
        }

        /**
         * @private
         * @type {?Timestamp}
         */
        this._expirationTime = null;

        if (props.expirationTime != null) {
            this.setExpirationTime(props.expirationTime);
        }
    }

    /**
     * @internal
     * @param {proto.TransactionBody} body
     * @returns {AccountUpdateTransaction}
     */
    static _fromProtobuf(body) {
        const update = /** @type {proto.ICryptoUpdateTransactionBody} */ (body.cryptoUpdateAccount);

        return new AccountUpdateTransaction({
            accountId:
                update.accountIDToUpdate != null
                    ? AccountId._fromProtobuf(
                          /** @type {proto.IAccountID} */ (update.accountIDToUpdate)
                      )
                    : undefined,
            key: update.key != null ? _fromProtoKey(update.key) : undefined,
            receiverSignatureRequired:
                update.receiverSigRequired != null
                    ? update.receiverSigRequired
                    : undefined,
            proxyAccountId:
                update.proxyAccountID != null
                    ? AccountId._fromProtobuf(
                          /** @type {proto.IAccountID} */ (update.proxyAccountID)
                      )
                    : undefined,
            autoRenewPeriod:
                update.autoRenewPeriod != null
                    ? update.autoRenewPeriod.seconds != null
                        ? update.autoRenewPeriod.seconds
                        : undefined
                    : undefined,
            expirationTime:
                update.expirationTime != null
                    ? Timestamp._fromProtobuf(update.expirationTime)
                    : undefined,
        });
    }

    /**
     * @returns {?AccountId}
     */
    getAccountId() {
        return this._accountId;
    }

    /**
     * Sets the account ID which is being updated in this transaction.
     *
     * @param {AccountId | string} accountId
     * @returns {AccountUpdateTransaction}
     */
    setAccountId(accountId) {
        this._requireNotFrozen();
        this._accountId =
            accountId instanceof AccountId
                ? accountId
                : AccountId.fromString(accountId);

        return this;
    }

    /**
     * @returns {?Key}
     */
    getKey() {
        return this._key;
    }

    /**
     * @param {Key} key
     * @returns {this}
     */
    setKey(key) {
        this._requireNotFrozen();
        this._key = key;

        return this;
    }

    /**
     * @returns {boolean}
     */
    getReceiverSignatureRequired() {
        return this._receiverSignatureRequired;
    }

    /**
     * @param {boolean} receiverSignatureRequired
     * @returns {this}
     */
    setReceiverSignatureRequired(receiverSignatureRequired) {
        this._requireNotFrozen();
        this._receiverSignatureRequired = receiverSignatureRequired;

        return this;
    }

    /**
     * @returns {?AccountId}
     */
    getProxyAccountId() {
        return this._proxyAccountId;
    }

    /**
     * @param {AccountId} proxyAccountId
     * @returns {this}
     */
    setProxyAccountId(proxyAccountId) {
        this._requireNotFrozen();
        this._proxyAccountId = proxyAccountId;

        return this;
    }

    /**
     * @returns {?Long}
     */
    getAutoRenewPeriod() {
        return this._autoRenewPeriod;
    }

    /**
     * @param {number | Long} autoRenewPeriod
     * @returns {this}
     */
    setAutoRenewPeriod(autoRenewPeriod) {
        this._requireNotFrozen();
        this._autoRenewPeriod =
            autoRenewPeriod instanceof Long
                ? autoRenewPeriod
                : Long.fromValue(autoRenewPeriod);

        return this;
    }

    /**
     * @returns {?Timestamp}
     */
    getExpirationTime() {
        return this._expirationTime;
    }

    /**
     * @param {Timestamp | Date} expirationTime
     * @returns {this}
     */
    setExpirationTime(expirationTime) {
        this._requireNotFrozen();
        this._expirationTime =
            expirationTime instanceof Date
                ? Timestamp.fromDate(expirationTime)
                : expirationTime;

        return this;
    }

    /**
     * @override
     * @protected
     * @param {Channel} channel
     * @returns {(transaction: proto.ITransaction) => Promise<proto.ITransactionResponse>}
     */
    _getMethod(channel) {
        return (transaction) => channel.crypto.updateAccount(transaction);
    }

    /**
     * @override
     * @protected
     * @returns {NonNullable<proto.TransactionBody["data"]>}
     */
    _getTransactionDataCase() {
        return "cryptoUpdateAccount";
    }

    /**
     * @override
     * @protected
     * @returns {proto.ICryptoUpdateTransactionBody}
     */
    _makeTransactionData() {
        return {
            accountIDToUpdate:
                this._accountId != null ? this._accountId._toProtobuf() : null,
            key: this._key != null ? _toProtoKey(this._key) : null,
            expirationTime: this._expirationTime,
            proxyAccountID:
                this._proxyAccountId != null
                    ? this._proxyAccountId._toProtobuf()
                    : null,
            autoRenewPeriod:
                this._autoRenewPeriod == null
                    ? null
                    : {
                          seconds: this._autoRenewPeriod,
                      },
            receiverSigRequiredWrapper:
                this._receiverSignatureRequired == null
                    ? null
                    : {
                          value: this._receiverSignatureRequired,
                      },
        };
    }
}

TRANSACTION_REGISTRY.set(
    "cryptoUpdateAccount",
    // eslint-disable-next-line @typescript-eslint/unbound-method
    AccountUpdateTransaction._fromProtobuf
);