import { createSlice } from '@reduxjs/toolkit'


export type AlertState = {
    readonly active: boolean
    readonly alert: {
        readonly severity: 'success' | 'info' | 'warning' | 'error'
        readonly message?: string | 'alert'
        readonly title: string | null
        readonly onClose: boolean
        readonly timeout: number
        readonly variant: 'outlined' | 'filled' | 'standard'
    }
    

}

const initialState: AlertState = {
    active: false,
    alert: {
        severity: 'info',
        message: 'empty alert',
        title: null,
        onClose: false,
        timeout: 5000,
        variant: 'standard',    
    },
}

const alertSlsice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        success(_state, action) {
            const { message, title, onClose, timeout, variant } = action.payload
            return {
                active: true,
                alert: {
                    severity: 'success',
                    message,
                    title,
                    onClose,
                    timeout,
                    variant
                },
            }
        },
        error(_state, action) {
            const { message, title, onClose, timeout, variant } = action.payload
            return {
                active: true,
                alert: {
                    severity: 'error',
                    message,
                    title,
                    onClose,
                    timeout,
                    variant
                },
            }
        },
        info(_state, action) {
            const { message, title, onClose, timeout, variant } = action.payload
            return {
                active: true,
                alert: {
                    severity: 'info',
                    message,
                    title,
                    onClose,
                    timeout,
                    variant
                },
            }
        },
        Warning(_state, action) {  
            const { message, title, onClose, timeout, variant } = action.payload
            return {
                active: true,
                alert: {
                    severity: 'warning',
                    message,
                    title,
                    onClose,
                    timeout,
                    variant
                },
            }
        
    }
    },
})

export const { success, error, info, Warning } = alertSlsice.actions
export default alertSlsice.reducer