'use client'

import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email is invalid').nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .nonempty('Password is required'),
})

type LoginFormInputs = z.infer<typeof loginSchema>

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to login')
      }

      const result = await response.json()
      console.log('Login successful:', result)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="flex flex-col items-center pt-20 min-h-screen">
      <div className="text-center mb-8 pb-8">
        <h1 className="text-8xl font-bold text-green-900">DRY</h1>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 rounded shadow-md border">
        <h2 className="text-2xl font-bold text-center text-green-900">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="block w-full px-3 py-2 mt-1 border border-gray-700 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="block w-full px-3 py-2 mt-1 border border-gray-700 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-black bg-green-900 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
          <div className="text-center">
            <a
              href="/register"
              className="block text-sm font-medium text-gray-500 hover:underline"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
