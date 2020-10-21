export interface IService {
    Name: string
    Client?: { [key: string]: unknown }

    DomiInit?: () => void
    DomiStart?: () => void
}

type ServiceClass<T = IService> = new () => T

/**
 * Helper method to spawn a thread
 */
const SpawnThread = (func: Function, ...args: unknown[]) => {
    const bindable = new Instance('BindableEvent')
    bindable.Event.Connect(() => func(...args))
    bindable.Fire()
    bindable.Destroy()
}

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
                        new Promise(async (r) => {
                            await service.DomiInit!()
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
                    SpawnThread(service.DomiStart)
                }
            })
        })
    }
}

export default DomiServer
