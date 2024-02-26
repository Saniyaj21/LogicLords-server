import jwt from 'jsonwebtoken'
import 'dotenv'

export const sendCookie = (user, res, statusCode = 200) => {

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,);

  res

    .cookie("token", token, {
      maxAge: new Date(
        Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "None",
      secure: true
    }).status(statusCode)
    .json({
      success: true,
      user,
      token
    })

}

