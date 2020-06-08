import React, { createContext, useState, useEffect, useCallback, useContext } from 'react'
import { Modal, Text, View } from 'react-native'
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

  const onRequestClose = useCallback(() => {
    setIsShowing(false)
    setCurrentToast(null)
  }, [setIsShowing, setCurrentToast])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Modal
        transparent
        animationType="slide"
        visible={isShowing}
        onRequestClose={onRequestClose}
      >
        <View style={{
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'rgba(190, 190, 190, 0.4)',
            borderRadius: 20,
            padding: 40
          }}>
            <Text>{currentToast && currentToast.message}</Text>
          </View>
        </View>
      </Modal>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
