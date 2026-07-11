import jwt from "jsonwebtoken"
export const jwtToken = (userId) => {
 return jwt.sign({id: userId}, process.env.JWT_SECRET, {
   expiresIn: "7d"
 }
)
}