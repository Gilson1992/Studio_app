"use server"

import { studioPublicFetch } from "@/app/_lib/studioPublic/client"
import {
  type AvailabilityResponse,
  type StudioPublicApiResponse,
} from "@/app/_lib/studioPublic/types"

interface GetAvailabilityParams {
  date: string
  professionalId: number
  serviceId: number
}

export const getAvailability = async ({
  date,
  professionalId,
  serviceId,
}: GetAvailabilityParams): Promise<string[]> => {
  const searchParams = new URLSearchParams({
    date,
    professional_id: String(professionalId),
    service_id: String(serviceId),
  })

  const response = await studioPublicFetch<
    StudioPublicApiResponse<AvailabilityResponse>
  >({
    path: `/availability?${searchParams.toString()}`,
    method: "GET",
  })

  return response.data.times
}
