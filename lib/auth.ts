import { User } from "@/types";

const USERS_KEY = "cga_users";
const CURRENT_USER_KEY = "cga_current_user";

export const auth = {
    signup: (user: User) => {
        if (typeof window === "undefined") return;
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

        // Check if user exists
        if (users.find((u: User) => u.email === user.email)) {
            throw new Error("User already exists");
        }

        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        auth.login(user.email, user.password || "");
        return user;
    },

    login: (email: string, password?: string) => {
        if (typeof window === "undefined") return;
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const user = users.find((u: User) => u.email === email && u.password === password);

        if (user) {
            // Don't store password in session
            const { password, ...safeUser } = user;
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
            return safeUser;
        }
        throw new Error("Invalid credentials");
    },

    logout: () => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(CURRENT_USER_KEY);
        window.location.href = "/auth/signin";
    },

    getCurrentUser: (): User | null => {
        if (typeof window === "undefined") return null;
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: (): boolean => {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem(CURRENT_USER_KEY);
    }
};
