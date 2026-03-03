import "server-only"

interface StudioPublicFetchInit extends RequestInit {
  path: string
}

export class StudioPublicApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "StudioPublicApiError"
    this.status = status
  }
}

export const studioPublicFetch = async <T>({
  path,
  ...init
}: StudioPublicFetchInit): Promise<T> => {
  const baseUrl = process.env.STUDIO_PUBLIC_API_URL
  const bookingKey = process.env.STUDIO_BOOKING_KEY

  if (!baseUrl) {
    throw new StudioPublicApiError(
      "Missing STUDIO_PUBLIC_API_URL environment variable",
      500,
    )
  }

  if (!bookingKey) {
    throw new StudioPublicApiError(
      "Missing STUDIO_BOOKING_KEY environment variable",
      500,
    )
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-BOOKING-KEY": bookingKey,
      ...(init.headers ?? {}),
    },
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.message ?? "Studio public API request failed"
    throw new StudioPublicApiError(message, response.status)
  }

  return payload as T
}
