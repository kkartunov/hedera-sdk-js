import Query from "../Query";
import AccountId from "./AccountId";
import LiveHash from "./LiveHash";
import proto from "@hashgraph/proto";
import Channel from "../Channel";

/**
 * @augments {Query<LiveHash>}
 */
export default class LiveHashQuery extends Query {
    /**
     * @param {object} props
     * @param {AccountId | string} [props.accountId]
     * @param {Uint8Array} [props.hash]
     */
    constructor(props = {}) {
        super();

        /**
         * @type {?AccountId}
         * @private
         */
        this._accountId = null;

        if (props.accountId != null) {
            this.setAccountId(props.accountId);
        }

        /**
         * @type {?Uint8Array}
         * @private
         */
        this._hash = null;

        if (props.hash != null) {
            this.setHash(props.hash);
        }
    }

    /**
     * Set the account to which the livehash is associated.
     *
     * @param {AccountId | string} accountId
     * @returns {this}
     */
    setAccountId(accountId) {
        this._accountId =
            accountId instanceof AccountId
                ? accountId
                : AccountId.fromString(accountId);

        return this;
    }

    /**
     * Set the SHA-384 data in the livehash.
     *
     * @param {Uint8Array} hash
     * @returns {this}
     */
    setHash(hash) {
        this._hash = hash;

        return this;
    }

    /**
     * @protected
     * @override
     * @param {Channel} channel
     * @returns {(query: proto.IQuery) => Promise<proto.IResponse>}
     */
    _getQueryMethod(channel) {
        return (query) => channel.crypto.getLiveHash(query);
    }

    /**
     * @protected
     * @override
     * @param {proto.IResponse} response
     * @returns {LiveHash}
     */
    _mapResponse(response) {
        // @ts-ignore
        return LiveHash._fromProtobuf(response.cryptoGetLiveHash.liveHash);
    }

    /**
     * @protected
     * @override
     * @param {proto.IQueryHeader} queryHeader
     * @returns {proto.IQuery}
     */
    _makeRequest(queryHeader) {
        return {
            cryptoGetLiveHash: {
                header: queryHeader,
                accountID: this._accountId?._toProtobuf(),
                hash: this._hash,
            },
        };
    }
}
