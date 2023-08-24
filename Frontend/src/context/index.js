import React from 'react'
import AuthProvider from './AuthProvider'
import NotificationProvider from './NotificationProvider'
import ThemeChanger from './ThemeChanger'
import SearchProvider from './SearchProvider'
import MoviesProvider from './MoviesProvider'


export default function ContextProviders({ children }) {
    return (
        <NotificationProvider>
            <SearchProvider>
                <MoviesProvider>
                    <AuthProvider>
                        <ThemeChanger>
                            {children}
                        </ThemeChanger>
                    </AuthProvider>
                </MoviesProvider>
            </SearchProvider>
        </NotificationProvider>
    )
}
