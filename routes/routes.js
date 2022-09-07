const Routes = (billService) => {
    const index = async (req, res) => {
        try {
            res.render("index", {
                totalBill: 0
            })
        } catch (error) {
            res.send("An error has occured!")
            console.log(error.stack)
        }
    }

    const plans = async (req, res) => {
        try {
            const plans = await billService.getAvailablePlans()
            res.render("plan", {
                plans
            })
        } catch (error) {
            res.send("An error has occured!")
            console.log(error.stack)
        }
    }

    const planUsers = async (req, res) => {
        try {
            const {id} = req.params
            const {plan} = req.query
            const users = await billService.usersForPlan(id)
            console.log(users)
            res.render("users", {
                plan,
                users
            })
        } catch (error) {
            res.send("An error has occured!")
            console.log(error.stack)
        }
    }

    const choosePlan = async (req, res) => {
        try {
            const plans = await billService.getAvailablePlans()
            res.render("link", {
                plans
            })
        } catch (error) {
            res.send("An error has occured!")
            console.log(error.stack)
        }
    }

    const calcBill = async (req, res) => {
        try {
            const {username, usage} = req.body
            const totalBill = await billService.calulateBill(username, usage)
            res.render("index", {
                totalBill: totalBill.toFixed(2)
            })
        } catch (error) {
            res.send("An error has occured!")
            console.log(error.stack)
        }
    }

    const allocateUser = async (req, res) => {
        try {
            const {username, plan} = req.body
            await billService.planForUser(username, plan)
            res.redirect(`/price_plans/${plan}`)
        } catch (error) {
            res.send("An error has occured!")
            console.log(error.stack)
        }
    }

    return {
        index,
        plans,
        planUsers,
        choosePlan,
        calcBill,
        allocateUser
    }
}

module.exports = Routes