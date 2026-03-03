"use client"

import { useMemo, useState, useTransition } from "react"
import { format, set } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "./ui/calendar"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { toast } from "sonner"
import { getAvailability } from "@/app/_actions/studioPublic/get-availability"
import { createAppointment } from "@/app/_actions/studioPublic/create-appointment"
import {
  type StudioProfessional,
  type StudioService,
} from "@/app/_lib/studioPublic/types"

interface ServiceItemProps {
  service: StudioService
  professionals: StudioProfessional[]
}

const ServiceItem = ({ service, professionals }: ServiceItemProps) => {
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    number | null
  >(null)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>()
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isLoadingTimes, startLoadingTimes] = useTransition()
  const [isSubmitting, startSubmitting] = useTransition()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const resetForm = () => {
    setSelectedDay(undefined)
    setSelectedProfessionalId(null)
    setSelectedTime(null)
    setAvailableTimes([])
    setName("")
    setPhone("")
    setEmail("")
  }

  const handleSheetChange = (open: boolean) => {
    setBookingSheetIsOpen(open)

    if (!open) {
      resetForm()
    }
  }

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) {
      return null
    }

    const [hours, minutes] = selectedTime.split(":").map(Number)

    return set(selectedDay, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    })
  }, [selectedDay, selectedTime])

  const loadTimes = (date: Date, professionalId: number) => {
    const formattedDate = format(date, "yyyy-MM-dd")

    startLoadingTimes(async () => {
      try {
        const times = await getAvailability({
          date: formattedDate,
          professionalId,
          serviceId: Number(service.id),
        })

        setAvailableTimes(times)
        setSelectedTime(null)
      } catch (error) {
        console.error(error)
        setAvailableTimes([])
        setSelectedTime(null)
        toast.error("Não foi possível carregar os horários.")
      }
    })
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setSelectedTime(null)

    if (!date || !selectedProfessionalId) {
      setAvailableTimes([])
      return
    }

    loadTimes(date, selectedProfessionalId)
  }

  const handleProfessionalChange = (professionalIdValue: string) => {
    if (!professionalIdValue) {
      setSelectedProfessionalId(null)
      setAvailableTimes([])
      setSelectedTime(null)
      return
    }

    const professionalId = Number(professionalIdValue)
    setSelectedProfessionalId(professionalId)
    setSelectedTime(null)

    if (selectedDay) {
      loadTimes(selectedDay, professionalId)
    }
  }

  const handleCreateAppointment = () => {
    if (!selectedProfessionalId || !selectedDay || !selectedTime) {
      toast.error("Selecione profissional, data e horário.")
      return
    }

    if (!name.trim() || !phone.trim()) {
      toast.error("Nome e telefone são obrigatórios.")
      return
    }

    startSubmitting(async () => {
      try {
        await createAppointment({
          customer: {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
          },
          service_id: Number(service.id),
          professional_id: selectedProfessionalId,
          date: format(selectedDay, "yyyy-MM-dd"),
          time: selectedTime,
        })

        handleSheetChange(false)
        toast.success("Agendamento criado com sucesso!")
      } catch (error) {
        console.error(error)
        toast.error("Não foi possível concluir o agendamento.")
      }
    })
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-3">
        <div>
          <h3 className="text-sm font-semibold">{service.name}</h3>
          {service.description && (
            <p className="text-sm text-gray-400">{service.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-primary">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </p>

          <Sheet open={bookingSheetIsOpen} onOpenChange={handleSheetChange}>
            <Button variant="secondary" size="sm">
              Agendar
            </Button>

            <SheetContent className="px-0">
              <SheetHeader>
                <SheetTitle>Agendar serviço</SheetTitle>
              </SheetHeader>

              <div className="space-y-4 border-b border-solid p-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profissional</label>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    value={selectedProfessionalId ?? ""}
                    onChange={(event) =>
                      handleProfessionalChange(event.currentTarget.value)
                    }
                  >
                    <option value="" disabled>
                      Selecione um profissional
                    </option>
                    {professionals.map((professional) => (
                      <option key={professional.id} value={professional.id}>
                        {professional.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Calendar
                  mode="single"
                  locale={ptBR}
                  selected={selectedDay}
                  onSelect={handleDateSelect}
                  fromDate={new Date()}
                  styles={{
                    head_cell: {
                      width: "100%",
                      textTransform: "capitalize",
                    },
                    cell: {
                      width: "100%",
                    },
                    button: {
                      width: "100%",
                    },
                    nav_button_previous: {
                      width: "32px",
                      height: "32px",
                    },
                    nav_button_next: {
                      width: "32px",
                      height: "32px",
                    },
                    caption: {
                      textTransform: "capitalize",
                    },
                  }}
                />

                {selectedDay && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Horários disponíveis</p>
                    <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                      {isLoadingTimes ? (
                        <p className="text-xs text-gray-400">
                          Carregando horários...
                        </p>
                      ) : availableTimes.length > 0 ? (
                        availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            className="rounded-full"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400">
                          Não há horários disponíveis para este dia.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5">
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(event) => setName(event.currentTarget.value)}
                />
                <Input
                  placeholder="Seu telefone"
                  value={phone}
                  onChange={(event) => setPhone(event.currentTarget.value)}
                />
                <Input
                  placeholder="Seu email (opcional)"
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                />
              </div>

              {selectedDate && (
                <p className="px-5 text-xs text-gray-400">
                  Horário selecionado:{" "}
                  {format(selectedDate, "dd/MM/yyyy 'às' HH:mm")}
                </p>
              )}

              <SheetFooter className="mt-5 px-5">
                <Button
                  onClick={handleCreateAppointment}
                  disabled={isSubmitting || professionals.length === 0}
                >
                  {isSubmitting ? "Confirmando..." : "Confirmar"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
