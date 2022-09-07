const assert = require("assert")
const pgp = require("pg-promise")({})
const config = {
    connectionString: process.env.DATABASE_URL || "postgresql://test:test123@localhost:5432/price_plans_test"
}
const db = pgp(config)
const BillService = require("../services/bill-service")

describe("Testing my Bill Service Factory Function", () => {
    beforeEach(async () => {
        await db.none("TRUNCATE FROM users")
    })

    it("should be able to add user price plan", async () => {
        const billService = BillService(db)

        await billService.planForUser("Lukhanyo", 1)

        assert.equal(true, await billService.findUser("Lukhanyo", 1))
    })

    it("should be able to update price plan of already existing user", async () => {
        const billService = BillService(db)

        await billService.planForUser("Lukhanyo", 1)

        assert.equal(true, await billService.findUser("Lukhanyo", 1))

        await billService.planForUser("Lukhanyo", 2)

        assert.equal(true, await billService.findUser("Lukhanyo", 2))
    })

    it("should be able to get all available price plans", async () => {
        const billService = BillService(db)

        const plans = await billService.getAvailablePlans()

        assert.equal(3, plans.length)
    })

    it("should be able to get users for subscribed price plan", async () => {
        const billService = BillService(db)

        await billService.planForUser("Lukhanyo", 1)
        await billService.planForUser("Vakele", 1)
        const sms100Users = await billService.usersForPlan(1)
        assert.equal(2, sms100Users.length)

        await billService.planForUser("Emihle", 2)
        const call100Users = await billService.usersForPlan(2)
        assert.equal(1, call100Users.length)

        const textMeUsers = await billService.usersForPlan(3)
        assert.equal(0, textMeUsers.length)
    })

    it("should be able to calculate user total phone bill given usage", async () => {
        const billService = BillService(db)

        await billService.planForUser("Lukhanyo", 1)

        const usage = "sms, sms, call, sms"
        assert.equal(2.95, await billService.calulateBill("Lukhanyo", usage))
    })

    after(async () => {
        await db.$pool.end()
    })
})