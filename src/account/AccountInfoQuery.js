import Query from "../Query";
import AccountId from "./AccountId";
import AccountInfo from "./AccountInfo";
import proto from "@hashgraph/proto";
import Channel from "../Channel";

/**
 * @augments {Query<AccountInfo>}
 */
export default class AccountInfoQuery extends Query {
    /**
     * @param {object} properties
     * @param {AccountId | string} [properties.accountId]
     */
    constructor(properties) {
        super();

        /**
         * @private
         * @type {?AccountId}
         */
        this._accountId = null;
        if (properties?.accountId != null) {
            this.setAccountId(properties?.accountId);
        }
    }

    /**
     * Set the account ID for which the info is being requested.
     *
     * @param {AccountId | string} accountId
     * @returns {AccountInfoQuery}
     */
    setAccountId(accountId) {
        this._accountId =
            accountId instanceof AccountId
                ? accountId
                : AccountId.fromString(accountId);

        return this;
    }

    /**
     * @protected
     * @override
     * @param {Channel} channel
     * @returns {(query: proto.IQuery) => Promise<proto.IResponse>}
     */
    _getQueryMethod(channel) {
        return (query) => channel.crypto.getAccountInfo(query);
    }

    /**
     * @protected
     * @override
     * @param {proto.IResponse} response
     * @returns {AccountInfo}
     */
    _mapResponse(response) {
        // @ts-ignore
        return AccountInfo._fromProtobuf(response.cryptoGetInfo.accountInfo);
    }

    /**
     * @protected
     * @override
     * @param {proto.IQueryHeader} queryHeader
     * @returns {proto.IQuery}
     */
    _makeRequest(queryHeader) {
        return {
            cryptoGetInfo: {
                header: queryHeader,
                accountID: this._accountId?._toProtobuf(),
            },
        };
    }
}
