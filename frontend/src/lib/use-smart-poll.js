'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useMissionControl } from '@/store/copilotStore'

export function useSmartPoll(
    callback,
    intervalMs,
    options = {}
) {
    const {
        pauseWhenConnected = false,
        pauseWhenDisconnected = false,
        pauseWhenSseConnected = false,
        backoff = false,
        maxBackoffMultiplier = 3,
        enabled = true,
    } = options

    const callbackRef = useRef(callback)
    const intervalRef = useRef(undefined)
    const backoffMultiplierRef = useRef(1)
    const isVisibleRef = useRef(true)
    const initialFiredRef = useRef(false)

    const { connection } = useMissionControl()

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    const shouldPoll = useCallback(() => {
        if (!enabled) return false
        if (!isVisibleRef.current) return false
        if (pauseWhenConnected && connection?.isConnected) return false
        if (pauseWhenDisconnected && !connection?.isConnected) return false
        if (pauseWhenSseConnected && connection?.sseConnected) return false
        return true
    }, [enabled, pauseWhenConnected, pauseWhenDisconnected, pauseWhenSseConnected, connection?.isConnected, connection?.sseConnected])

    const fire = useCallback(() => {
        if (!shouldPoll()) return
        const result = callbackRef.current()
        if (result instanceof Promise) {
            result.catch(() => {
                if (backoff) {
                    backoffMultiplierRef.current = Math.min(
                        backoffMultiplierRef.current + 0.5,
                        maxBackoffMultiplier
                    )
                }
            })
        }
    }, [shouldPoll, backoff, maxBackoffMultiplier])

    const startInterval = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (!shouldPoll()) return

        const effectiveInterval = backoff
            ? intervalMs * backoffMultiplierRef.current
            : intervalMs

        intervalRef.current = setInterval(() => {
            if (shouldPoll()) {
                callbackRef.current()
            }
        }, effectiveInterval)
    }, [intervalMs, shouldPoll, backoff])

    useEffect(() => {
        if (!initialFiredRef.current && enabled) {
            initialFiredRef.current = true
            callbackRef.current()
        }

        startInterval()

        const handleVisibilityChange = () => {
            isVisibleRef.current = document.visibilityState === 'visible'

            if (isVisibleRef.current) {
                backoffMultiplierRef.current = 1
                fire()
                startInterval()
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = undefined
                }
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = undefined
            }
        }
    }, [fire, startInterval, enabled])

    useEffect(() => {
        startInterval()
    }, [connection?.isConnected, connection?.sseConnected, startInterval])

    return fire
}
