import DomiServer, { IResource } from './Domi'

class TestService implements IResource {
    Name = 'TestService'

    async DomiInit() {
        wait(5)
        print('Init from server')
    }

    DomiStart() {
        print('Start from server')
    }
}

DomiServer.RegisterResource(TestService)
DomiServer.Start().then(() => {
    print('Finished starting')
})
