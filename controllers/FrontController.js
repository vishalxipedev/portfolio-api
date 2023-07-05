const User = require('../models/User');
const UserMetas = require('../models/UserMetas')

const userDetails = async (req, res) => {

    const user_details = await User.aggregate([
        {
            $lookup: {
                from: "usermetas",
                localField: "_id",
                foreignField: "user_id",
                as: "user_metas"
            }

        }, { $unwind: '$user_metas' }
    ]);

    if (user_details) {
        res.send({
            status: true,
            data: user_details[0]
        });
    } else {
        res.send({
            status: false,
            message: _trans("user_does_not_exists")
        })
    }
}

module.exports = {
    userDetails
}