import { verifyToken } from "../../utils/auth";
import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const userId = await verifyToken(req);
      await dbConnect();
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
