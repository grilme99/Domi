export interface IService {
    Name: string

    DomiInit?: () => void
    DomiStart?: () => void
}

type ServiceClass<T = IService> = new () => T

namespace DomiServer {
    export const Services = new Map<string, IService>()
    let started = false

    /**
     * Registers a service with Domi. Must be called before using Domi.Start()
     * @param service The Domi service to register
     */
    export const RegisterService = (service: ServiceClass) => {
        assert(!started, 'Cannot register a service if Domi has already started')

        const constructedService = new service()
        assert(!Services.get(constructedService.Name), `Service ${constructedService.Name} already exists`)
        Services.set(constructedService.Name, constructedService)

        return constructedService
    }

    /**
     * Starts Domi. Fist it initializes all services registered and then starts them.
     */
    export const Start = async () => {
        if (started) throw 'Domi already started'
        started = true

        return new Promise((resolve) => {
            // Bind remotes

            // Init
            const startServicePromises: Promise<void>[] = []
            Services.forEach((service) => {
                if (service.DomiInit !== undefined) {
                    startServicePromises.push(
                        new Promise((r) => {
                            service.DomiInit!()
                            r()
                        }),
                    )
                }
            })
            resolve(Promise.all(startServicePromises))
        }).then(() => {
            // Start
            Services.forEach((service) => {
                if (service.DomiStart !== undefined) {
                    service.DomiStart()
                }
            })
        })
    }
}

export default DomiServer
