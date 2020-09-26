import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import light from '@/presentation/theme/light'
import Login from '.'
import { ValidationStub } from '@/presentation/test'
import faker from 'faker'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const sut = render(
    <ThemeProvider theme={light}>
      <Login validation={validationStub}/>
    </ThemeProvider>
  )
  return { sut, validationStub }
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('should start with initial state', () => {
    const { sut } = makeSut()
    const statusWrap = sut.getByTestId('status-wrap')
    expect(statusWrap.childElementCount).toBe(0)

    const submitButton = sut.getByTestId('submit-button') as HTMLButtonElement
    expect(submitButton.disabled).toBeTruthy()
  })

  test('should show email error if Validation fails', () => {
    const { sut, validationStub } = makeSut()
    const errorMsg = faker.random.words()
    validationStub.errorMessage = errorMsg
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const errorMessage = sut.getByTestId('emailError')
    expect(errorMessage.textContent).toBe(errorMsg)
  })
})
