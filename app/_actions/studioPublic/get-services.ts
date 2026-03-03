"use server"

import { studioPublicFetch } from "@/app/_lib/studioPublic/client"
import {
  type StudioPublicApiResponse,
  type StudioService,
} from "@/app/_lib/studioPublic/types"

export const getServices = async (): Promise<StudioService[]> => {
  const response = await studioPublicFetch<
    StudioPublicApiResponse<StudioService[]>
  >({
    path: "/services",
    method: "GET",
  })

  return response.data
}
