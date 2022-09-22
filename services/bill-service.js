const BillService = (db) => {
    const findUser = async (username, planid) => {
        const results = await db.oneOrNone("SELECT * FROM users WHERE first_name = $1 AND user_plan = $2", [username, planid])
        return results !== null
    }

    const planForUser = async (username, planid) => {
        const condition = await db.one("SELECT COUNT(*) FROM users WHERE first_name = $1", [username])
        if(condition.count != 0){
            await db.none("UPDATE users SET user_plan = $2 WHERE first_name = $1", [username, planid])
        } else {
            await db.none("INSERT INTO users (first_name, user_plan) VALUES ($1, $2)", [username, planid])
        }
    }

    const getAvailablePlans = async () => {
        return await db.many("SELECT * FROM price_plan")
    }

    const usersForPlan = async (planid) => {
        const users = await db.manyOrNone("SELECT * FROM users WHERE user_plan = $1", [planid])
        return users || []
    }

    const calulateBill = async (username, usage) => {
        const user = await db.oneOrNone("SELECT * FROM users AS u INNER JOIN price_plan AS p ON p.id = u.user_plan WHERE u.first_name = $1", [username])
        if(!user) return false
        let total = 0
        if(user !== null){
            usage = usage.replace(/\s/g, "").split(",")
            usage_amount = usage.map(action => action === "sms" ? user.sms_price : action === "call" ? user.call_price : 0)
            total = usage_amount.reduce((previousValue, currentValue) => previousValue + currentValue)
        }
        return total
    }

    const addNewPlan = async ({plan, callcost, smscost}) => {
        plan = plan.trim().toLowerCase()
        const findPlan = await db.oneOrNone("SELECT * FROM price_plan WHERE plan_name = $1", [plan])
        if(findPlan === null){
            await db.none("INSERT INTO price_plan (plan_name, call_price, sms_price) VALUES ($1, $2, $3)", [plan, callcost, smscost])
        } else {
            return false
            // update works but  cancelled it
            await db.none("UPDATE price_plan SET call_price = $2, sms_price = $2 WHERE plan_name = $1", [plan, callcost, smscost])
        }
    }

    return {
        findUser, 
        planForUser,
        getAvailablePlans,
        usersForPlan,
        calulateBill,
        addNewPlan
    }
}

module.exports = BillService