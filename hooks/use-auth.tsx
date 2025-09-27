"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  username: string
  email: string
  role: "user" | "premium" | "admin"
  avatar?: string
  level: number
  experience: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем токен при загрузке приложения
    const token = localStorage.getItem("auth_token")
    if (token) {
      // В реальном приложении здесь будет проверка токена на сервере
      const mockUser: User = {
        id: "1",
        username: "AnimeUser",
        email: "user@example.com",
        role: "user",
        level: 5,
        experience: 1250,
      }
      setUser(mockUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock успешного входа
      const mockUser: User = {
        id: "1",
        username: "AnimeUser",
        email,
        role: "user",
        level: 5,
        experience: 1250,
      }

      const token = "mock_jwt_token_" + Date.now()
      localStorage.setItem("auth_token", token)
      if (rememberMe) {
        localStorage.setItem("remember_me", "true")
      }

      setUser(mockUser)
    } catch (error) {
      throw new Error("Ошибка входа")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock успешной регистрации
      const mockUser: User = {
        id: "1",
        username,
        email,
        role: "user",
        level: 1,
        experience: 0,
      }

      const token = "mock_jwt_token_" + Date.now()
      localStorage.setItem("auth_token", token)

      setUser(mockUser)
    } catch (error) {
      throw new Error("Ошибка регистрации")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("remember_me")
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
