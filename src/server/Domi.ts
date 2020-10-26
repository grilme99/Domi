export interface IResource {
    /** Unique name of the resource */
    Name: string
    /** This method is called first and is where you should create all of your connections. */
    DomiInit?: () => Promise<void> | void
    /** This method is called when all other services have initialized. It is now safe to reference other services. */
    DomiStart?: () => void
}

type ResourceClass<T = IResource> = new () => T

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
    export const Services = new Map<string, IResource>()
    let started = false

    /**
     * Registers a resource with Domi. Must be called before using Domi.Start()
     * @param resource The Domi resource to register
     */
    export const RegisterResource = (resource: ResourceClass) => {
        assert(!started, 'Cannot register a resource if Domi has already started')

        const cResource = new resource()
        assert(!Services.get(cResource.Name), `Resource ${cResource.Name} already exists`)

        Services.set(cResource.Name, cResource)
        return cResource
    }

    /**
     * Starts Domi. Fist it initializes all resources registered and then starts them.
     */
    export const Start = async () => {
        if (started) throw 'Domi already started'
        started = true

        return new Promise((resolve) => {
            // Init
            const startServicePromises: Promise<void>[] = []
            Services.forEach((resource) => {
                if (resource.DomiInit !== undefined) {
                    startServicePromises.push(
                        new Promise(async (r) => {
                            await resource.DomiInit!()
                            r()
                        }),
                    )
                }
            })
            resolve(Promise.all(startServicePromises))
        }).then(() => {
            // Start
            Services.forEach((resource) => {
                if (resource.DomiStart !== undefined) {
                    SpawnThread(resource.DomiStart)
                }
            })
        })
    }
}

export default DomiServer
