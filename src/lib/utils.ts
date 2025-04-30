import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getApiBaseUrl(): string {
    const isDebug = process.env.NODE_ENV === "development" || process.env.DEBUG === "true";
    return isDebug
        ? "http://localhost:5000/api"
        : "https://medstock-server.onrender.com/api";
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
