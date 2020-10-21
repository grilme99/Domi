namespace Domi {
    export const services = new Map<string, IService>()
    export let started = false

    interface IService {
        Name: string
        Client?: IServiceClient

        DomiInit?: () => void
        DomiStart?: () => void
    }

    interface IServiceClient {}

    export const CreateService = (service: IService) => {
        assert(!services.get(service.Name), `Service ${service.Name} already exists`)
        services.set(service.Name, service)
    }

    export const Start = async () => {
        if (started) throw 'Domi already started'
        started = true

        return new Promise((resolve) => {
            // Bind remotes

            // Init
            const startServicePromises: Promise<void>[] = []
            services.forEach((service) => {
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
            services.forEach((service) => {
                if (service.DomiStart !== undefined) {
                    service.DomiStart()
                }
            })
        })
    }
}

export = Domi
