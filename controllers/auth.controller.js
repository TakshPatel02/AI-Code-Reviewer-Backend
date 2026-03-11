import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import { loginSchema, signupSchema } from '../validations/user.validations.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.util.js';

// The function responsible for handling user signup. It validates the input, checks for existing users, hashes the password, creates a new user, generates tokens, and sends the appropriate reponse back to the client.
const signupUser = async (req, res) => {
    try {
        const validatedData = await signupSchema.safeParseAsync(req.body);

        if (validatedData.error) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors: validatedData.error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))
            });
        }

        const { username, email, password } = validatedData.data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email already exists.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const payload = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        }

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await User.updateOne({ _id: newUser._id }, { refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return res.status(201).json({
            success: true,
            message: 'User signed up successfully.',
            data: {
                id: newUser._id,
                accessToken: accessToken
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while signing up the user.'
        })
    }
}

// The function responsible for handling user login. It validates the input, checks for the user's existence, compares passwords, generates tokens, and sends the appropriate response back to the client.
const loginUser = async (req, res) => {
    try {
        const validatedData = await loginSchema.safeParseAsync(req.body);

        if (validatedData.error) {
            return res.staus(400).json({
                success: false,
                message: 'Validation failed.',
            });
        }

        const { email, password } = validatedData.data;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await User.updateOne({ _id: user._id }, { refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully.',
            data: {
                id: user._id,
                accessToken: accessToken
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while logging in the user.'
        })
    }
}

// The function responsible for handling user logout. It checks for the presence of a refresh token, invalidates it in the database, clears the cookie, and sends the appropriate response back to the client.
const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'No refresh token provided.'
            });
        }

        await User.updateOne({ refreshToken }, { refreshToken: null });

        res.clearCookie('refreshToken');

        return res.status(200).json({
            success: true,
            message: 'User logged out successfully.'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while logging out the user.'
        })
    }

}

// The function responsible for generating a new access token using the refresh token. It checks for the presence of the refresh token, validates it, generates a new access token, and sends the appropriate response back to the client.
const newRefreshTokenGeneration = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'No refresh token provided.'
            });
        }

        const user = await User.findOne({ refreshToken });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid refresh token.'
            });
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || decoded.payload.id !== user._id.toString()) {
                return res.stauts(400).json({
                    success: false,
                    message: 'Invalid refresh token.'
                });
            }

            const newAccessToken = generateAccessToken(payload);
            return res.status(200).json({
                success: true,
                message: 'Access token refreshed successfully.',
                data: {
                    accessToken: newAccessToken
                }
            });
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while refreshing the access token.'
        })
    }
}

export {
    signupUser,
    loginUser,
    logoutUser,
    newRefreshTokenGeneration
}