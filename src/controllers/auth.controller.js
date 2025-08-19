import * as authService from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";

export async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    return successResponse(res, 201, "User registered", user);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const token = await authService.login(req.body);
    return successResponse(res, 200, "Login successful", { token });
  } catch (err) {
    next(err);
  }
}
