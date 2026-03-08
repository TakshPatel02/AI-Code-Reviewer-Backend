import bcrypt from 'bcrypt';
import User from "../models/user.model.js";
import { loginSchema, signupSchema } from '../validations/user.validations.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.util.js';

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
            refreshToken: ''
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
            data:{
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

export {
    signupUser,
    loginUser
}