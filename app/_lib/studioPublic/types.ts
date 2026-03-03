export interface StudioService {
  id: number | string
  name: string
  description: string | null
  price: number | string
  duration: number
  category: string | null
}

export interface StudioProfessional {
  id: number | string
  name: string
  phone?: string | null
  specialties?: string | null
  work_schedule?: string | null
  open_windows?: {
    id: number
    start_date: string
    end_date: string
    status: "open" | "closed"
  }[]
}

export interface AvailabilityResponse {
  date: string
  professional_id: number
  service_id: number
  times: string[]
}

export interface StudioPublicApiResponse<T> {
  data: T
}
