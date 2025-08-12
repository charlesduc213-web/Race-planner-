// Authentication utilities and context
"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin" // Changed créateur back to admin
  clubId?: string
  stravaConnected: boolean
  themePreference: "light" | "dark"
  languagePreference: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("race-planner-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)

    initializeCreatorAccount()
  }, [])

  const initializeCreatorAccount = () => {
    const registeredUsers = JSON.parse(localStorage.getItem("race-planner-registered-users") || "[]")
    const creatorExists = registeredUsers.find((u: any) => u.email === "charlesduc213@gmail.com")

    if (!creatorExists) {
      const creatorAccount = {
        id: "creator-001",
        email: "charlesduc213@gmail.com",
        password: "Jilyas87",
        firstName: "Charles",
        lastName: "Duc",
        role: "admin", // Changed to admin role
        clubId: "1",
        stravaConnected: false,
        themePreference: "light",
        languagePreference: "fr",
      }

      registeredUsers.push(creatorAccount)
      localStorage.setItem("race-planner-registered-users", JSON.stringify(registeredUsers))
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const registeredUsers = JSON.parse(localStorage.getItem("race-planner-registered-users") || "[]")
    const foundUser = registeredUsers.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser

      if (email === "charlesduc213@gmail.com") {
        userWithoutPassword.role = "admin" // Force admin role for this email

        // Update the stored user data to have admin role
        const updatedUsers = registeredUsers.map((u: any) => (u.email === email ? { ...u, role: "admin" } : u))
        localStorage.setItem("race-planner-registered-users", JSON.stringify(updatedUsers))
      }

      setUser(userWithoutPassword)
      localStorage.setItem("race-planner-user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem("race-planner-registered-users") || "[]")
    const existingUser = registeredUsers.find((u: any) => u.email === email)

    if (existingUser) {
      return false // User already exists
    }

    const isAdmin = email === "charlesduc213@gmail.com" // Check for admin email

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this would be hashed
      firstName,
      lastName,
      role: isAdmin ? "admin" : ("user" as const), // Set admin role for special email
      clubId: "1", // Default club
      stravaConnected: false,
      themePreference: "light" as const,
      languagePreference: "fr",
    }

    // Save to registered users
    registeredUsers.push(newUser)
    localStorage.setItem("race-planner-registered-users", JSON.stringify(registeredUsers))

    // Auto-login the new user
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("race-planner-user", JSON.stringify(userWithoutPassword))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("race-planner-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
