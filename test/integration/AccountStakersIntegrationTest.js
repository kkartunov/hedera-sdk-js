import Hbar from "../src/Hbar";
import newClient from "./client";
import AccountStakersQuery from "../../src/account/AccountStakersQuery";

describe("AccountStakers", function () {
    it("should be executable", async function () {
        this.timeout(10000);

        const client = newClient();
        const operatorId = client.operatorAccountId;

        let errorThrown = false;

        try {
            await new AccountStakersQuery()
                .setAccountId(operatorId)
                .setMaxQueryPayment(new Hbar(1))
                .execute(client);
        } catch (_) {
            errorThrown = true;
        }

        expect(errorThrown).to.be.true;
    });
});