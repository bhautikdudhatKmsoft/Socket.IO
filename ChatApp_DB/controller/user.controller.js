const UserServices = require("../services/user.service");
const userServices = new UserServices();

exports.addUser = async (req, res) => {
  try {
    let user = await userServices.getUser({ userId: req.body.userId });

    if (user) {
      return res.status(400).json({ message: `User already found.........` });
    }

    user = await userServices.addUser({ ...req.body });

    res.status(201).json({ user, message: `User added successfully.............` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Interanal server error.......${console.error()}` });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let user = await userServices.getUserById(req.query.UID);

    if (!user) {
      return res.status(404).json({ message: `User does not found.........` });
    }

    const pushData = req.body.pushData || false;
    delete req.body.pushData; // Remove this key to prevent MongoDB errors

    user = await userServices.updateUser(user.userId, req.body, pushData);

    res.status(200).json({ user, message: `User update successfully.............` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal server error..........${console.error()}` });
  }
};

exports.getUser = async(req,res) => {
    try {
        let user = await userServices.getUserById(req.query.UID);

        if (!user) {
          return res.status(404).json({ message: `User does not found.........` });
        }
        
        res.status(404).json(user);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message : `internal server error......${console.error()}`});
    }
}