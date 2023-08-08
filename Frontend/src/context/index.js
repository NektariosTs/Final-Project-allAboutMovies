import React from 'react'
import AuthProvider from './AuthProvider'
import NotificationProvider from './NotificationProvider'
import ThemeChanger from './ThemeChanger'

export default function ContextProviders({ children }) {
    return (
        <NotificationProvider>
            <AuthProvider>
                <ThemeChanger>
                    {children}
                </ThemeChanger>
            </AuthProvider>
        </NotificationProvider>
    )
}
