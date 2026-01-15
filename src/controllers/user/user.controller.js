import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import authService from "../../services/user/user.services.js";
import { registerSchema, loginSchema } from "../../validations/user/user.validation.js";

export const register = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) throw error;

  const user = await authService.registerUser(req.body);

  res.status(201).json(
    ApiResponse.success(user, "Registration successful")
  );
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const { user, token } = await authService.loginUser(
    identifier,
    password
  );

  res
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .status(200)
    .json(
      ApiResponse.success(
        { token, user },
        "Login successful"
      )
    );
});