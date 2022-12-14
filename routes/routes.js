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
            if(!username && !usage){
                req.flash("error", "Please enter your name and usage")
            } else if(!username){
                req.flash("error", "Please enter your name")
            } else if(!usage){
                req.flash("error", "Please enter usage")
            } else {
                const totalBill = await billService.calulateBill(username, usage)
                if(totalBill === false){
                    req.flash("error", "You are not subscribed to a price plan")
                } else {
                    req.session.bill = totalBill
                }
            }
            res.redirect("back")
        } catch (error) {
            res.send("An error has occured!")
            console.log(error.stack)
        }
    }

    const allocateUser = async (req, res) => {
        try {
            const {username, plan} = req.body
            if(!username && !plan){
                req.flash("error", "Please enter your name and choose a plan")
                res.redirect("back")
            } else if(!username){
                req.flash("error", "Please enter your name")
                res.redirect("back")
            } else if(!plan){
                req.flash("error", "Please choose a plan")
                res.redirect("back")
            } else {
                await billService.planForUser(username, plan)
                res.redirect(`/price_plans/${plan}`)
            }
        } catch (error) {
            res.send("An error has occured!")
            console.log(error.stack)
        }
    }

    const newPlan = async (req, res) => {
        res.render("new")
    }

    const addNewPlan = async (req, res) => {
        let {plan, callcost, smscost} = req.body
        if(!plan || !callcost || !smscost){
            req.flash("error", "Please make sure fill in all the fields")
        } else {
            const exist = await billService.addNewPlan(req.body)
            if(exist === false){
                req.flash("error", "Plan name already exist")
            } else {
                req.flash("success", "Price plan added successfully")
            }
        }
        res.redirect("back")
    }

    return {
        index,
        plans,
        planUsers,
        choosePlan,
        calcBill,
        allocateUser,
        newPlan,
        addNewPlan
    }
}

module.exports = Routes