import Header from "./_components/header"
import ServiceItem from "./_components/service-item"
import { getProfessionals } from "./_actions/studioPublic/get-professionals"
import { getServices } from "./_actions/studioPublic/get-services"

const Home = async () => {
  try {
    const [services, professionals] = await Promise.all([
      getServices(),
      getProfessionals(),
    ])

    return (
      <div>
        <Header />

        <div className="space-y-6 p-5">
          <div>
            <h1 className="text-xl font-bold">Agende seu atendimento</h1>
            <p className="text-sm text-gray-400">
              Escolha um serviço, profissional, data e horário disponíveis.
            </p>
          </div>

          {services.length === 0 ? (
            <p className="text-sm text-gray-400">
              Nenhum serviço ativo disponível no momento.
            </p>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={service}
                  professionals={professionals}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error(error)

    return (
      <div>
        <Header />
        <div className="space-y-2 p-5">
          <h1 className="text-xl font-bold">Agende seu atendimento</h1>
          <p className="text-sm text-gray-400">
            Não foi possível carregar os dados de agendamento.
          </p>
          <p className="text-xs text-gray-500">
            Configure STUDIO_PUBLIC_API_URL e STUDIO_BOOKING_KEY no servidor do
            Studio_APP.
          </p>
        </div>
      </div>
    )
  }
}

export default Home
