import DomiServer, { IService } from './DomiServer'

class TestService implements IService {
    Name = 'TestService'
    Client = {
        HelloWorld() {
            return 'Hello, world!'
        },
    }

    async DomiInit() {
        wait(5)
        print('Init from server')
    }

    DomiStart() {
        print('Start from server')
    }
}

DomiServer.RegisterService(TestService)
DomiServer.Start().then(() => {
    print('Finished starting')
})
