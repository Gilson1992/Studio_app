"use server"

import { studioPublicFetch } from "@/app/_lib/studioPublic/client"

interface CreateAppointmentParams {
  customer: {
    name: string
    phone: string
    email?: string
  }
  service_id: number
  professional_id: number
  date: string
  time: string
}

export interface CreatedAppointment {
  id: number
  date: string
  start_time: string
  end_time: string
}

export const createAppointment = async (
  payload: CreateAppointmentParams,
): Promise<CreatedAppointment> => {
  const response = await studioPublicFetch<{ data: CreatedAppointment }>({
    path: "/appointments",
    method: "POST",
    body: JSON.stringify(payload),
  })

  return response.data
}
