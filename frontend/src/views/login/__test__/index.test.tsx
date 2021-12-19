/** @jest-environment jsdom */

import React from 'react'
import userEvent from '@testing-library/user-event'

import { Login } from '#views/login'
import { act, render, screen } from '#utils/test-utils'
import { userData } from './constants'

test('<Login />', async () => {
  render(<Login />)

  let welcomeHeader = screen.getByRole('heading', { name: 'Welcome' })
  let logInButton = screen.getByRole('button', { name: 'Log in' })

  expect(welcomeHeader).toBeInTheDocument()
  expect(logInButton).toBeInTheDocument()
  expect(logInButton).toBeDisabled()

  await act(async () => {
    userEvent.type(await screen.findByLabelText('Username'), 'john_doe')
    userEvent.type(await screen.findByLabelText('Password'), 's3cret')
  })

  expect(logInButton).toBeEnabled()

  fetchMock.mockResponses(
    [JSON.stringify({ authToken: 'authToken123' }), { status: 201 }],
    [JSON.stringify(userData), { status: 200 }],
  )

  expect(localStorage.authToken).toBeUndefined()

  await act(async () => {
    await userEvent.click(logInButton)
  })

  expect(welcomeHeader).not.toBeInTheDocument()
  expect(localStorage.authToken).toBeTruthy()
  expect(logInButton).not.toBeInTheDocument()

  const logOutButton = screen.getByRole('button', { name: 'Log out' })
  const youAreLoggedInParagraph = screen.getByText(
    (_, node) => node?.textContent === `You are logged in as ${userData.username}.`,
  )

  expect(logOutButton).toBeInTheDocument()
  expect(youAreLoggedInParagraph).toBeInTheDocument()

  await act(async () => {
    await userEvent.click(logOutButton)
  })

  expect(logOutButton).not.toBeInTheDocument()

  welcomeHeader = screen.getByRole('heading', { name: 'Welcome' })
  logInButton = screen.getByRole('button', { name: 'Log in' })

  expect(welcomeHeader).toBeInTheDocument()
  expect(logInButton).toBeInTheDocument()
  expect(localStorage.authToken).toBeUndefined()
})