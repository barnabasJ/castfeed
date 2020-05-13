import React, { createContext, useState, useEffect, useCallback, useContext } from 'react'
import { Modal, Text } from 'react-native'
import concat from 'lodash/concat'
import slice from 'lodash/slice'
import isEmpty from 'lodash/isEmpty'

const ToastContext = createContext(null)

export const Toaster: React.FunctionComponent = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const [currentToast, setCurrentToast] = useState(null)
  const [isShowing, setIsShowing] = useState(false)

  const show = useCallback((message: string, duration: number) => {
    setToasts(toasts => concat(toasts, { message, duration }))
  }, [setToasts])

  useEffect(() => {
    if (!isShowing) {
      if (!isEmpty(toasts) && isEmpty(currentToast)) {
        setCurrentToast(toasts[0])
        setToasts(slice(toasts, 1))
        setIsShowing(true)
      }
    }
  }, [toasts, setToasts, currentToast, setCurrentToast, isShowing, setIsShowing])

  useEffect(() => {
    if (currentToast) {
      setIsShowing(true)
      const timeout = setTimeout(() => {
        setIsShowing(false)
        setCurrentToast(null)
      }, currentToast.duration)

      return () => clearTimeout(timeout)
    }
  }, [currentToast, setCurrentToast])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Modal
        animationType="slide"
        visible={isShowing}>
        <Text>{currentToast && currentToast.message}</Text>
      </Modal>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
