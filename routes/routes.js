const Routes = (billService) => {
    const index = async (req, res) => {
        try {
            const totalBill = req.session?.bill || 0
            delete req.session?.bill
            res.render("index", {
                totalBill: totalBill.toFixed(2)
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
            const users = await billService.usersForPlan(id)
            const plans = await billService.getAvailablePlans()
            const plan = plans.find(plan => plan.id == id)
            res.render("users", {
                plan,
                users,
                plan: plan.plan_name
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
            req.session.bill = totalBill
            res.redirect("back")
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