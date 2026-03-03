"use server"

import { studioPublicFetch } from "@/app/_lib/studioPublic/client"
import {
  type StudioProfessional,
  type StudioPublicApiResponse,
} from "@/app/_lib/studioPublic/types"

export const getProfessionals = async (): Promise<StudioProfessional[]> => {
  const response = await studioPublicFetch<
    StudioPublicApiResponse<StudioProfessional[]>
  >({
    path: "/professionals",
    method: "GET",
  })

  return response.data
}
